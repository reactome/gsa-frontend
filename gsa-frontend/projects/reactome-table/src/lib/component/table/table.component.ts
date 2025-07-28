import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  linkedSignal,
  OnChanges,
  OnDestroy,
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
  first, firstValueFrom,
  map,
  Observable,
  share,
  skip,
  tap,
} from "rxjs";
import {isDefined} from "../../model/utils.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {safeInput} from "../../utils/web-component-utils";
import {toSignal} from "@angular/core/rxjs-interop";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {downloadTable} from "../download-table/download-table.component";


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


@UntilDestroy()
@Component({
  selector: 'reactome-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableStore],
  standalone: false
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('flyingRename');
  readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>('root');
  readonly cornerRef = viewChild<ElementRef<HTMLTableCellElement>>('corner');
  readonly viewport = viewChild.required<CdkVirtualScrollViewport>('scrollViewport');
  isDraggingMouse: boolean = false;
  isDraggingFile: boolean = false;

  readonly userSettings = input<Partial<Settings>>({});
  readonly name = input<string>('default-name');
  readonly table = input<string[][]>();

  readonly numberOfColumns = input<number | undefined>(undefined);
  readonly numberOfRows = input<number | undefined>(undefined);

  // Virtual Viewport management
  readonly minColWidth = input<number>(12);
  readonly rowHeight = input<number>(25);
  readonly maxHeight = input<number | undefined>(undefined);

  readonly minBufferRows = input<number>(50);
  readonly maxBufferRows = input<number>(100);

  minBufferPx = computed(() => this.minBufferRows() * this.rowHeight());
  maxBufferPx = computed(() => this.maxBufferRows() * this.rowHeight());

  height = computed(() => {
    let height = (this.data().length + (this.settings()?.addRow ? 1 : 0)) * this.rowHeight() + this.scrollDimensions().bottom;
    if (this.maxHeight()) height = height < this.maxHeight()! ? height : this.maxHeight()!;
    return height;
  });
  scrollOffset = signal(0)

  // Styling logic reactive to resize
  scrollDimensions = linkedSignal(() => this.getScrollDimensions());
  scrollDimensionsObserver = new ResizeObserver(() => this.scrollDimensions.set(this.getScrollDimensions()));

  getScrollDimensions() {
    const scrollPanel = this.viewport().elementRef.nativeElement;
    return {
      bottom: scrollPanel.offsetHeight - scrollPanel.clientHeight,
      right: scrollPanel.offsetWidth - scrollPanel.clientWidth,
    };
  }

  cornerRect = linkedSignal(() => this.cornerRef()?.nativeElement.getBoundingClientRect())
  cornerObserver = new ResizeObserver(() => this.cornerRect.set(this.cornerRef()?.nativeElement.getBoundingClientRect()))

  stickyOffset = linkedSignal(() => {
    const cornerRect = this.cornerRect();
    return {
      top: cornerRect?.height || 0,
      left: cornerRect?.width || 0,
      ...this.scrollDimensions()
    }
  })

  edgeVisibility = signal({top: true, bottom: true, left: true, right: true});


  // Core logic
  data: Signal<Cell[][]>
  settings: Signal<Settings | undefined>
  data$: Observable<Cell[][]> = this.tableStore.data$;
  hasData$: Observable<boolean> = this.tableStore.hasData$;
  cleanData$: Observable<string[][]> = this.tableStore.cleanData$;
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

  @Output() tableChange: Observable<string[][]> = this.cleanData$.pipe(
    skip(1)
  );

  constructor(private clipboard: Clipboard, public readonly tableStore: TableStore) {
    this.data = toSignal(this.tableStore.data$, {
      initialValue: [[{
        value: '',
        selected: false,
        visibility: 'visible'
      }]]
    });
    this.settings = toSignal(this.tableStore.settings$);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateEdgeVisibility();
      this.scrollDimensionsObserver.observe(this.viewport()!.elementRef.nativeElement)
      this.cornerObserver.observe(this.cornerRef()!.nativeElement)
    })
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

    this.tableStore.init({
      table: this.table(),
      numberOfRows: this.numberOfRows(),
      numberOfColumns: this.numberOfColumns(),
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings'] && !changes['userSettings'].firstChange) this.tableStore.settings({settings: this.userSettings()});
  }

  ngOnDestroy(): void {
    this.cornerObserver.disconnect()
    this.scrollDimensionsObserver.disconnect()
  }


  mousedown($event: MouseEvent) {
    this.isDraggingMouse = true;
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
    if (this.isDraggingMouse) {
      let stop = this.getCell($event);
      if (this.previousStop?.x !== stop.x || this.previousStop?.y !== stop.y) this.tableStore.selectRange({stop});
      this.previousStop = stop;
    }
  }

  mouseup() {
    this.isDraggingMouse = false;
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

  importFile(file: File, replace = true): void {
    this.tableStore.importFile({file, replace});
  }

  importFileContent(fileContent: { content: string, type: 'csv' | 'tsv' }, replace = true): void {
    this.tableStore.importFileContent({...fileContent, replace})
  }

  exportFile(): void {
    this.tableStore.cleanData$.pipe(first()).subscribe(table => downloadTable(table, this.name()))
  }

  async getCurrentData(): Promise<string[][]> {
    return firstValueFrom(this.tableStore.cleanData$)
  }

  adjustPlaceholder() {
    this.scrollOffset.set(this.viewport().getRenderedRange().start * this.rowHeight())
  }

  trackByIndex: TrackByFunction<any> = <T>(index: number, element: T) => {
    return index
  }

  async onDropFile($event: DragEvent) {
    $event.preventDefault();
    this.isDraggingFile = false;
    if (!$event.dataTransfer) return

    const settings = await firstValueFrom(this.settings$);

    const firstFile = $event.dataTransfer.items ?
      Array.from($event.dataTransfer.items)
        .filter((item) => item.kind === 'file') // If dropped items aren't files, reject them
        .map((item) => item.getAsFile()!)?.[0] :
      $event.dataTransfer.files?.[0];

    if (firstFile) this.importFile(firstFile, settings.dropReplace)
  }

  dragCounter = 0

  onDragEnter($event: DragEvent) {
    this.dragCounter++;
    if ($event.dataTransfer && $event.dataTransfer.files)
      this.isDraggingFile = true;
  }

  onDragLeave() {
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.isDraggingFile = false
    }
  }

  updateEdgeVisibility() {
    const viewport = this.viewport();
    this.edgeVisibility.set({
      top: viewport.measureScrollOffset('top') < 2,
      bottom: viewport.measureScrollOffset('bottom') < 2,
      right: viewport.measureScrollOffset('right') < 2,
      left: viewport.measureScrollOffset('left') < 2,
    })
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
