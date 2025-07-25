import {
  Component,
  computed,
  ElementRef,
  input,
  OnChanges,
  OnInit,
  Output,
  signal,
  Signal,
  SimpleChanges,
  TrackByFunction,
  viewChild
} from '@angular/core';
import {Settings} from "../../model/table.model";
import {Clipboard} from '@angular/cdk/clipboard';
import {Cell, Coords, Ranges, TableStore} from "../../state/table.store";
import {
  combineLatest,
  combineLatestWith,
  delay,
  distinctUntilChanged,
  filter,
  first,
  map,
  Observable,
  share,
  skip,
  tap
} from "rxjs";
import {isDefined} from "../../model/utils.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {safeInput} from "../../utils/web-component-utils";
import {toSignal} from "@angular/core/rxjs-interop";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";


interface SelectedCellRange {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

type Direction = "up" | "down" | "left" | "right";
/**
 * [x,y]
 */
type Coord = [number, number];
type Range = { start: Coord, stop?: Coord };

type Rect = { x: number; y: number, width: number, height: number };

@UntilDestroy()
@Component({
  selector: 'reactome-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableStore],
  standalone: false
})
export class TableComponent implements OnInit, OnChanges {
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('flyingRename');
  readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>('root');
  readonly viewport = viewChild.required<CdkVirtualScrollViewport>('scrollViewport');
  isDragging: boolean = false;

  readonly userSettings = input<Partial<Settings>>({});
  readonly table = input.required<string[][]>();
  readonly name = input<string>('default-name');

  readonly minColWidth = input<number>(12);
  readonly rowHeight = input<number>(25);
  readonly maxHeight = input<number>(500);

  readonly minBufferRows = input<number>(50);
  readonly maxBufferRows = input<number>(100);

  minBufferPx = computed(() => this.minBufferRows() * this.rowHeight());
  maxBufferPx = computed(() => this.maxBufferRows() * this.rowHeight());

  height = computed(() => {
    const BORDER_WIDTH = 1;
    const height = this.data().length * (this.rowHeight() + BORDER_WIDTH) + BORDER_WIDTH;
    return height < this.maxHeight() ? height : this.maxHeight();
  });
  scrollOffset = signal(0)


  data: Signal<Cell[][]>
  data$: Observable<Cell[][]> = this.tableStore.data$;
  start$: Observable<Coords> = this.tableStore.start$;
  stop$: Observable<Coords> = this.tableStore.stop$;
  startCell$: Observable<HTMLTableCellElement> = this.start$.pipe(
    distinctUntilChanged(Ranges.equals),
    delay(0), // Allow resizing of cell before updating size of input
    tap(start => {
      if (start.y < this.viewport().getRenderedRange().start || start.y > this.viewport().getRenderedRange().end) {
        this.viewport().scrollToIndex(start.y, 'instant')
      }
    }),
    delay(0), // Make sure cell is rendered after having been scrolled to
    map(start => this.getHTMLCellElement(start.x, start.y)),
    tap((cell) => {
      cell.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'instant'})
      if (isHiddenBehindSticky(cell, this.viewport().elementRef.nativeElement, this.rowHeight()))
        scrollToElementManually(cell, this.viewport().elementRef.nativeElement, this.rowHeight())
    }),
    share()
  );
  startClasses$: Observable<Record<string | number, boolean>> = combineLatest([this.startCell$, this.tableStore.hasFocus$],
    (start, hasFocus) =>
      Array.from(start?.classList || [])
        .reduce((o, clazz) => ({...o, [clazz]: true}), {'visible': hasFocus} as Record<string | number, boolean>));
  inputLevel$: Observable<number> = this.start$.pipe(map(start => start.x === 0 ? 6 : start.y === 0 ? 4 : 2));
  inputValue$: Observable<string> = this.tableStore.value$;
  maxColumns$ = this.tableStore.maxColumns$;

  startCoords$: Observable<DOMRect> = this.startCell$.pipe(
    filter(isDefined),
    combineLatestWith(this.inputValue$), // Resize input upon value change
    distinctUntilChanged(),
    delay(0),
    map(([cell,]) => {
      const cellRect = cell.getBoundingClientRect();
      if (!cellRect) return cellRect;
      const tableCoords = this.viewport().elementRef.nativeElement.getBoundingClientRect()
      cellRect.x += this.viewport().measureScrollOffset('left') - tableCoords?.x;
      cellRect.y += this.viewport().measureScrollOffset('top') - tableCoords?.y;
      let style = window.getComputedStyle(cell);
      cellRect.width -= (parseFloat(style.getPropertyValue('padding-left')) + parseFloat(style.getPropertyValue('padding-right')));
      cellRect.height -= (parseFloat(style.getPropertyValue('padding-top')) + parseFloat(style.getPropertyValue('padding-bottom')));
      return cellRect;
    })
  );

  settings$: Observable<Settings> = this.tableStore.settings$;
  value: string;

  @Output() tableChange: Observable<string[][]> = this.data$.pipe(
    skip(1),
    map((data) => data.map(row => row.map(cell => cell.value)))
  );

  constructor(private clipboard: Clipboard, public readonly tableStore: TableStore) {
    this.data = toSignal(this.tableStore.data$, {
      initialValue: [[{
        value: '',
        selected: false,
        visibility: 'visible'
      }]]
    });
  }

  ngOnInit(): void {
    safeInput(this, 'table');
    safeInput(this, 'userSettings');

    //Initialize settings
    this.tableStore.settings({settings: this.userSettings()});

    // Focus input after position and size updated
    this.startCoords$.pipe(
      delay(1),
      untilDestroyed(this)
    ).subscribe(() => this.focusInput());

    this.inputValue$.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.value = value);

    this.tableStore.import({
      table: this.table(),
      hasColNames: true,
      hasRowNames: true,
      fullImport: true,
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings'] && !changes['userSettings'].firstChange) this.tableStore.settings({settings: this.userSettings()});
  }


  mousedown($event: MouseEvent) {
    this.isDragging = true;
    let {x, y} = this.getCell($event);
    this.tableStore.write({value: this.value});
    this.selectCell(x, y, $event.shiftKey);
    $event.preventDefault()
  }

  focusInput() {
    const input = this.input()?.nativeElement;
    input?.focus();
  }

  selectCell(x: number, y: number, shift: boolean = false) {
    if (isNaN(x) || isNaN(y)) return;
    this.tableStore.selectCell({coords: {x, y}, shift: shift});
    this.focusInput();
  }


  private previousStop: Coords;

  mousemove($event: MouseEvent) {
    if (this.isDragging) {
      let stop = this.getCell($event);
      if (this.previousStop?.x !== stop.x || this.previousStop?.y !== stop.y) this.tableStore.selectRange({stop});
      this.previousStop = stop;
    }
  }

  mouseup() {
    this.isDragging = false;
  }

  deselect() {
    this.tableStore.deselect();
  }

  addColumn() {
    this.tableStore.addColumn();
  }

  addRow() {
    this.tableStore.addRow();
  }

  deleteColumn(x: number) {
    this.tableStore.deleteColumn({x});
  }

  deleteRow(y: number) {
    this.tableStore.deleteRow({y});
  }

  focusLastCell($event: any) {
    this.tableStore.focusLast()
  }

  keydown($event: KeyboardEvent, input?: HTMLInputElement): void {
    setTimeout(() => {
      const shift = $event.shiftKey;

      this.tableStore.write({value: input?.value || this.value});

      const keyToAction: Map<string, () => void> = new Map([
        ["ArrowRight", () => this.tableStore.right({shift})],
        ["ArrowLeft", () => this.tableStore.left({shift})],
        ["ArrowUp", () => this.tableStore.up({shift})],
        ["ArrowDown", () => this.tableStore.down({shift})],
        ["Delete", () => this.tableStore.delete()],
        ["Enter", () => this.tableStore.down({shift: false})],
        ["Tab", () => shift
          ? this.tableStore.left({shift: false})
          : this.tableStore.right({shift: false})
        ]
      ]);
      const action = keyToAction.get($event.key);
      if (action) {
        action.call(this);
        $event.preventDefault();
      }
    })
  }


  pasteValues($event: ClipboardEvent) {
    $event.preventDefault();
    const pastedData = $event.clipboardData?.getData('text')?.split('\n').map(row => row.split('\t'));
    if (pastedData) this.tableStore.paste({table: pastedData})
  }


  copyValues() {
    this.tableStore.range$.pipe(
      first()
    ).subscribe(range => this.clipboard.copy(range.map(row => row.join("\t")).join("\n")));
  }

  getHTMLCellElement(x: number, y: number): HTMLTableCellElement {
    return this.rootRef()?.nativeElement.querySelector(`[x='${x}'][y='${y}']`) as HTMLTableCellElement;
  }

  getCell($event: MouseEvent): Coords {
    let x = parseInt(($event.target as HTMLTableCellElement).getAttribute("x") as string);
    let y = parseInt(($event.target as HTMLTableCellElement).getAttribute("y") as string);
    return {x, y};
  }

  clear(): void {
    this.tableStore.clear();
  }

  importFile(file: {file: File, mapHeaders: boolean } | Observable<{file: File, mapHeaders: boolean }>): void {
    this.tableStore.importFile(file)
  }

  importFileContent(fileContent: { content: string, type: 'csv' | 'tsv' , mapHeaders: boolean} | Observable<{
    content: string,
    type: 'csv' | 'tsv',
    mapHeaders: boolean
  }>): void {
    this.tableStore.importFileContent(fileContent)
  }

  exportFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = `${this.name()}.csv`; // the file name
    this.tableStore.rawData$.pipe(first()).subscribe(
      table => {
        dlink.href = encodeURI('data:text/tsv;charset=utf-8,' + table.map(row => row.join("\t")).join("\n"));
        dlink.click(); // this will trigger the dialog window
        dlink.remove();
      }
    )
  }


  adjustPlaceholder() {
    this.scrollOffset.set(this.viewport().getRenderedRange().start * this.rowHeight())
  }

  trackByIndex: TrackByFunction<any> = <T>(index: number, element: T)=> {
    return index
  }
}


function isHiddenBehindSticky(el: HTMLElement, container: HTMLElement, stickyHeight = 60): boolean {
  const containerTop = container.getBoundingClientRect().top;
  const elementTop = el.getBoundingClientRect().top;
  const offset = elementTop - containerTop;
  return offset <= stickyHeight;
}

function scrollToElementManually(el: HTMLElement, container: HTMLElement, stickyHeight = 60) {
  const containerTop = container.getBoundingClientRect().top;
  const elementTop = el.getBoundingClientRect().top;
  const offset = elementTop - containerTop;
  container.scrollTo({
    top: container.scrollTop + offset - stickyHeight,
    behavior: 'instant',
  });
}
