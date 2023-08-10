import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Settings} from "../../model/table.model";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatButton} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {TableActions} from "./state/table.action";
import {Cell, Coords} from "./state/table.state";
import {combineLatest, filter, first, map, Observable, tap} from "rxjs";
import {TableOrder} from "./state/table.util";
import {tableFeature} from "./state/table.selector";
import {isDefined} from "../utils";
import {Subset} from "../../model/utils.model";


type CellCoord = { x: number, y: number, parentElement: any };

export type Mapper<T> = {
  [p: string | number]: T
}

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


@Component({
  selector: 'gsa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  @ViewChild('addCol') columnButton: MatButton;
  renameVisible: boolean = false
  isDragging: boolean = false;

  @Input() userSettings: Subset<Settings>;
  @Input() table: string[][];
  @Output() tableChange: EventEmitter<string[][]> = new EventEmitter<string[][]>();

  start$: Observable<Coords>;
  startCell$: Observable<HTMLTableCellElement>;
  startClasses$: Observable<Mapper<boolean>>;
  startCoords$: Observable<DOMRect>;
  stop$: Observable<Coords>;
  startType$: Observable<'row' | 'col' | 'cell'>;
  inputLevel$: Observable<number>;
  isCell$: Observable<boolean>;
  inputValue$: Observable<string>;
  data$: Observable<Cell[][]>;
  settings$: Observable<Settings>;
  value: string;

  constructor(private clipboard: Clipboard, private cd: ChangeDetectorRef, private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(TableActions.settings({settings: this.userSettings}));
    this.data$ = this.store.select(tableFeature.selectData(TableOrder.ROW_BY_ROW)).pipe(
      tap(table => this.tableChange.emit(table.map(row => row.map(cell => cell.value))))
    );

    this.start$ = this.store.select(tableFeature.selectStart);
    this.startCell$ = this.start$.pipe(map(start => this.getHTMLCellElement(start.x, start.y)));
    this.startCoords$ = this.startCell$.pipe(
      filter(isDefined),
      map(cell => {
        const cellRect = cell.getBoundingClientRect();
        if (!cellRect) return cellRect;
        const tablePosition = this.rootRef?.nativeElement;
        const tableCoords = tablePosition?.getBoundingClientRect();
        cellRect.x += tablePosition?.scrollLeft - tableCoords?.x - 1;
        cellRect.y += tablePosition?.scrollTop - tableCoords?.y - 1;
        let style = window.getComputedStyle(cell);
        cellRect.width -= (parseFloat(style.getPropertyValue('padding-left')) + parseFloat(style.getPropertyValue('padding-right')));
        cellRect.height -= (parseFloat(style.getPropertyValue('padding-top')) + parseFloat(style.getPropertyValue('padding-bottom')));
        return cellRect;
      })
    );
    this.stop$ = this.store.select(tableFeature.selectStop);
    this.startClasses$ = combineLatest([this.startCell$, this.store.select(tableFeature.selectHasFocus)],
      (start, hasFocus) =>
        Array.from(start.classList)
          .reduce((o, clazz) => ({...o, [clazz]: true}), {'visible': hasFocus} as Mapper<boolean>))
    this.inputLevel$ = this.start$.pipe(map(start => start.x === 0 ? 6 : start.y === 0 ? 4 : 2))

    this.inputValue$ = this.store.select(tableFeature.selectValue).pipe(tap(value => console.log("input cell changed", value)));
    this.inputValue$.subscribe(value => this.value = value);

    this.showChangeInput()
    this.startType$ = this.start$.pipe(map(start => start.x === 0 ? 'row' : start.y === 0 ? 'col' : 'cell'));
    this.isCell$ = this.startType$.pipe(map(type => type === 'cell'));
    this.settings$ = this.store.select(tableFeature.selectSettings);

    this.store.dispatch(TableActions.import({
      table: this.table,
      hasColNames: true,
      hasRowNames: true,
      fullImport: true
    }));
  }

  ngAfterViewInit() {
    // Now we can find the HTML elements since they are initialised
    // this.setFirstElement()
    // this.cd.detectChanges()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings']) this.store.dispatch(TableActions.settings({settings: this.userSettings}));
  }

  mousedown($event: MouseEvent) {
    // ($event.target as HTMLElement).getAttribute("x") !== null
    // if (($event.target as HTMLElement).getAttribute("x") !== null) { //Don't do this when adding a column (Button does not have attribute y)
    // this.deselect();
    this.isDragging = true;
    let {x, y} = this.getCell($event);
    this.selectCell(x, y, $event.shiftKey);
    // this.changeValue($event);
    $event.preventDefault()


    // }
  }

  focusInput() {
    this.input?.nativeElement.focus();
  }

  selectCell(x: number, y: number, shift: boolean = false) {
    if (isNaN(x) || isNaN(y)) return;
    this.store.dispatch(TableActions.select({coords: {x, y}, shift: shift}))
    setTimeout(this.focusInput.bind(this), 0);

    // this.firstSelected = new CellInfo(undefined, x, y);
    // this.lastSelected = new CellInfo(undefined, x, y);
    // this.showSelected("add");
  }

  showSelected(method: string) {
    // let {minX, maxX, minY, maxY} = this.computeRange();
    // for (let x = minX; x <= maxX; x++) {
    //   for (let y = minY; y <= maxY; y++) {
    //     let parentElement = this.getHTMLCellElement(x, y);
    //     switch (method) {
    //       case "add":
    //         parentElement?.classList.add("selected");
    //         this.getHTMLCellElement(-1, y)?.classList.add('chosen-th');
    //         this.getHTMLCellElement(x, -1)?.classList.add('chosen-th');
    //         break
    //       case "remove":
    //         parentElement?.classList.remove("selected");
    //         this.getHTMLCellElement(-1, y)?.classList.remove('chosen-th');
    //         this.getHTMLCellElement(x, -1)?.classList.remove('chosen-th');
    //         break
    //     }
    //
    //   }
    // }
  }

  private previousStop: Coords;

  mousemove($event: MouseEvent) {
    if (this.isDragging) {
      let stop = this.getCell($event);
      if (this.previousStop?.x !== stop.x || this.previousStop?.y !== stop.y) this.store.dispatch(TableActions.selectRange({stop}));
      this.previousStop = stop;

      // this.deselect();
      // let {x, y} = this.getCell($event);
      // if (isNaN(x) && isNaN(y)) { // Cell is the same as first selected cell
      //   this.lastSelected = new CellInfo(undefined, this.firstSelected.x, this.firstSelected.y);
      // } else {
      //   this.input.nativeElement.classList.add("selected");
      //   this.lastSelected = new CellInfo(undefined, x, y);
      // }
      // this.showSelected("add");
    }
  }

  mouseup() {
    this.isDragging = false;
  }

  deselect() {
    // if (this.settings.columns.length > 0) this.renameCell();
    // this.showSelected("remove");
    // this.input?.nativeElement?.classList.remove("selected");
    // this.lastSelected = this.firstSelected

    this.store.dispatch(TableActions.deselect())
  }

  focusOnCell(x: number, y: number) {
    const parentElement = this.getHTMLCellElement(x, y);
    // this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(<HTMLElement>parentElement));
    this.showChangeInput();
  }

  addColumn() {
    this.store.dispatch(TableActions.addColumn())
    // this.deselect();
    // this.settings.columns.push("Annotation" + (this.settings.columns.length + 1));
    // this.settings.data.forEach((row) => row.push(new CellInfo()));
    // setTimeout(() => this.focusOnCell(this.settings.columns.length - 1, -1));
    // this.firstSelected = new CellInfo(undefined, this.settings.columns.length - 1, -1)
    // this.lastSelected = new CellInfo(undefined, this.settings.columns.length - 1, -1)
  }

  addRow() {
    this.store.dispatch(TableActions.addRow())
  }

  changeValue($event: MouseEvent) {
    // $event.preventDefault();
    // let cell = this.getCell($event);
    // setTimeout(() => this.firstSelected = new CellInfo(undefined, cell.x, cell.y, this.getRelativeCoords(cell.parentElement)));
    // this.showChangeInput();
  }

  getRelativeCoords(element: HTMLElement): DOMRect {
    let cell = element.getBoundingClientRect();
    let tablePosition = this.rootRef.nativeElement;
    let tableCoords = tablePosition.getBoundingClientRect();
    cell.x -= tableCoords.x;
    cell.y -= tableCoords.y;
    cell.x += tablePosition.scrollLeft;
    cell.y += tablePosition.scrollTop;
    return cell;
  }

  showChangeInput() {
    // let type = this.firstSelected.x === -1 ? "row" : this.firstSelected.y === -1 ? "col" : "cell";
    // if (type === "col") { // It is a column
    //   this.renameValue = this.settings.columns[this.firstSelected.x];
    // } else if (type === "row") { // It is a row
    //   this.renameValue = this.settings.rows[this.firstSelected.y];
    // } else { // It is a cell
    //   this.renameValue = this.settings.data[this.firstSelected.y][this.firstSelected.x].value;
    // }
    // if ((type === "col" && this.settings.renameCols) || (type === "row" && this.settings.renameRows) || (type === "cell" && this.settings.changeCells)) {
    //   this.renameVisible = true
    //   setTimeout(() => {
    //     this.input.nativeElement.focus();
    //     this.input.nativeElement.scrollIntoView({block: "nearest", inline: "nearest", behavior: 'smooth'});
    //     // window.scrollBy(0, 0)
    //   });
    // } else {
    //
    //   this.renameVisible = false
    // }
  }

  renameCell(input: HTMLInputElement) {
    console.log(`Rename Cell : value ${input.value}`)
    this.store.dispatch(TableActions.write({value: input.value}));
    this.store.dispatch(TableActions.down({shift: false}));


    // if (this.firstSelected.y === -1) { // It is a column
    //   this.settings.columns[this.firstSelected.x] = this.renameValue;
    // } else if (this.firstSelected.x === -1) { // It is a row
    //   this.settings.rows[this.firstSelected.y] = this.renameValue;
    // } else { // It is a cell
    //   this.settings.data[this.firstSelected.y][this.firstSelected.x].value = this.renameValue;
    // }
  }

  deleteColumn(x: number) {
    this.store.dispatch(TableActions.deleteColumn({x}))
    // $event.preventDefault();
    // $event.stopPropagation();
    // this.settings.columns.splice(y, 1);
    // this.settings.data.forEach((row) => row.splice(y, 1));
    // this.renameVisible = false;
  }

  navigateTableDefault() {
  }

  // move(x: number, y: number, direction: Direction): Coord {
  // return this.moveObj[direction]([x, y])
  // }

  // columnEndExceeded(y: number): boolean {
  //     return y === this.settings.rows.length
  // }
  //
  // rowEndExceeded(x: number): boolean {
  //     return x === this.settings.columns.length
  // }
  //
  // columnBeginExceeded(y: number): boolean {
  //     return (y === -1 && !this.settings.renameCols) || (y === -2)
  // }
  //
  // rowBeginExceeded(x: number): boolean {
  //     return (x === -1 && !this.settings.renameRows) || (x === -2);
  // }

  // computeExceeded(x: number, y: number): Coord {
  //     if (this.columnEndExceeded(y)) {
  //         y = this.settings.renameCols ? -1 : 0;
  //     }
  //     if (this.columnBeginExceeded(y)) {
  //         y = this.settings.rows.length - 1;
  //     }
  //     if (this.rowEndExceeded(x)) {
  //         x = this.settings.renameRows ? -1 : 0;
  //     }
  //     if (this.rowBeginExceeded(x)) {
  //         x = this.settings.columns.length - 1;
  //     }
  //     return [x, y];
  // }

  // moveCell(x: number, y: number, direction: Direction): Coord {
  //   [x, y] = this.move(x, y, direction);
  //   [x, y] = this.computeExceeded(x, y);
  //   switch (direction) {
  //     case "down":
  //       this.store.dispatch(TableActions.down());
  //       break;
  //     case "up":
  //       this.store.dispatch(TableActions.up());
  //       break;
  //     case "left":
  //       this.store.dispatch(TableActions.left());
  //       break;
  //     case "right":
  //       this.store.dispatch(TableActions.right());
  //       break;
  //   }
  //   return [x, y];
  // }

  // findPreviousTabStop(element: HTMLElement) {
  //     var universe = document.querySelectorAll('input, button, select, textarea, a[href]');
  //     var list = Array.prototype.filter.call(universe, function (item) {
  //         return item.tabIndex >= "0"
  //     });
  //     var index = list.indexOf(element);
  //     return list[index - 1] || list[0];
  // }
  //
  // unfocusTableBegin(x: number, y: number): boolean {
  //     if (this.rowBeginExceeded(x - 1) && this.columnBeginExceeded(y - 1)) {
  //         this.blurInput();
  //         setTimeout(() => this.input.nativeElement.blur());
  //         var nextEl = this.findPreviousTabStop(this.input.nativeElement);
  //         nextEl.focus();
  //         return true
  //     }
  //     return false
  // }
  //
  // unfocusTableEnd(x: number, y: number): boolean {
  //     if (this.rowEndExceeded(x + 1) && this.columnEndExceeded(y + 1)) {
  //         this.renameVisible = false;
  //         setTimeout(() => this.columnButton.focus());
  //         return true
  //     }
  //     return false
  // }

  focusLastCell($event: any) {
    this.store.dispatch(TableActions.focusLast())
    // setTimeout(() => {
    //   let [x, y] = [this.settings.columns.length - 1, this.settings.rows.length - 1]
    //   let parentElement = this.getHTMLCellElement(x, y);
    //
    //   this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
    //   this.lastSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
    //   this.showSelected("add")
    //   this.showChangeInput();
    // }, 0);

  }

  keydown($event: KeyboardEvent, input?: HTMLInputElement): void {
    // if (document.activeElement === this.input.nativeElement) return;
    const shift = $event.shiftKey;

    console.log(`KeyDown ${$event.key}, input: ${input?.value}`)

    this.store.dispatch(TableActions.write({value: input?.value || this.value}));

    // let x = this.lastSelected.x;
    // let y = this.lastSelected.y;
    const keyToAction: Map<string, () => void> = new Map([
      ["ArrowRight", () => this.store.dispatch(TableActions.right({shift}))],
      ["ArrowLeft", () => this.store.dispatch(TableActions.left({shift}))],
      ["ArrowUp", () => this.store.dispatch(TableActions.up({shift}))],
      ["ArrowDown", () => this.store.dispatch(TableActions.down({shift}))],
      ["Enter", () => this.store.dispatch(TableActions.down({shift: false}))],
      ["Tab", () => shift
        ? this.store.dispatch(TableActions.left({shift: false}))
        : this.store.dispatch(TableActions.right({shift: false}))
      ]
    ]);
    const action = keyToAction.get($event.key);
    if (action) {
      action.call(this);
      $event.preventDefault();
    }

    // const action = keyToAction.get($event.key);
    // if (action) {
    //   $event.preventDefault();
    //   let [x, y] = action();
    //   if (x === -1 && y === -1) return
    //   if ((!$event.shiftKey) || ($event.shiftKey && $event.key === 'Tab')) {
    //     [x, y] = [this.firstSelected.x + (x - this.lastSelected.x), this.firstSelected.y + (y - this.lastSelected.y)]
    //   }
    //   let parentElement = this.getHTMLCellElement(x, y);
    //   this.deselect();
    //   this.input.nativeElement.classList.add("selected");
    //
    //   setTimeout(() => {
    //     if ((!$event.shiftKey) || ($event.shiftKey && $event.key === 'Tab')) {
    //       this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
    //       this.input.nativeElement.classList.remove("selected");
    //     }
    //     this.lastSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
    //     this.showSelected("add")
    //     this.showChangeInput();
    //   }, 0);

  }


  pasteValues($event: ClipboardEvent) {
    $event.preventDefault();
    const pastedData = $event.clipboardData?.getData('text')?.split('\n').map(row => row.split('\t'));
    if (pastedData) this.store.dispatch(TableActions.paste({table: pastedData, order: TableOrder.ROW_BY_ROW}))
    // let rows: string[] = pastedData?.split('\n');
    // let pasteData: string[][] = rows.map(row => row.split('\t'));
    //
    // let x = this.firstSelected.x;
    // let y = this.firstSelected.y;
    // this.renameValue = pasteData[0][0];
    // pasteData.forEach((row, indexX) => {
    //   row.forEach((cell, indexY) => {
    //     this.settings.data[y + indexY][x + indexX].value = cell;
    //   })
    // })
    // setTimeout(() => {
    //   const firstSelectedHTML = this.getHTMLCellElement(x, y);
    //   this.firstSelected.coordinate = this.getRelativeCoords(firstSelectedHTML);
    //   this.showChangeInput()
    // }, 0);

  }

  deleteSelectedArea() {
    if (document.activeElement !== this.input.nativeElement)
      this.store.dispatch(TableActions.delete())
    // setTimeout(() => this.firstSelected = new CellInfo(undefined, this.firstSelected.x, this.firstSelected.y, this.getRelativeCoords(this.getHTMLCellElement(this.firstSelected.x, this.firstSelected.y))));
    //
    // let {minX, maxX, minY, maxY} = this.computeRange();
    // if (minX !== maxX || minY !== maxY) {
    //   for (let x = minX; x <= maxX; x++) {
    //     for (let y = minY; y <= maxY; y++) {
    //       if (y === -1) this.settings.columns[x] = ""
    //       else if (x === -1) this.settings.rows[y] = ""
    //       else this.settings.data[y][x].value = ""
    //     }
    //   }
    //   this.renameValue = ""
    // }
    // this.deselect()
    // this.selectCell(this.firstSelected.x, this.firstSelected.y)
  }

  copyValues() {
    // let copyText: string = ""
    // let {minX, maxX, minY, maxY} = this.computeRange();
    // for (let x = minX; x <= maxX; x++) {
    //   for (let y = minY; y <= maxY; y++) {
    //     copyText += this.settings.data[y][x].value;
    //     if (y < maxY) copyText += "\t";
    //   }
    //   if (x < maxX) copyText += "\n";
    // }
    // const temp_selected = this.firstSelected;
    // const temp_rename = this.renameValue;
    this.store.select(tableFeature.selectRange)
      .pipe(first())
      .subscribe(range => this.clipboard.copy(range.map(row => row.join("\t")).join("\n")));
    // setTimeout(() => {
    //   this.firstSelected = temp_selected
    //   this.lastSelected = temp_selected
    //   this.renameValue = temp_rename
    // })
  }

  getHTMLCellElement(x: number, y: number): HTMLTableCellElement {
    return this.rootRef?.nativeElement.querySelector(`[x = '${x}'][y = '${y}']`) as HTMLTableCellElement;
  }

  computeRange() {
    // const minX = Math.min(this.firstSelected.x, this.lastSelected.x);
    // const maxX = Math.max(this.firstSelected.x, this.lastSelected.x);
    // const minY = Math.min(this.firstSelected.y, this.lastSelected.y);
    // const maxY = Math.max(this.firstSelected.y, this.lastSelected.y);
    // return {minX, maxX, minY, maxY};
  }

  getCell($event: MouseEvent): Coords {
    let x = parseInt(($event.target as HTMLTableCellElement).getAttribute("x") as string);
    let y = parseInt(($event.target as HTMLTableCellElement).getAttribute("y") as string);
    // const parentElement = this.getHTMLCellElement(x, y);
    return {x, y};
  }


  blurInput() {
    this.renameVisible = false;
    // this.renameCell();
    // this.deselect();
    this.setFirstElement();
  }


  private setFirstElement() {
    // let y: number = this.settings.renameCols ? -1 : 0;
    // let x: number = this.settings.renameRows ? -1 : 0;
    // this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(this.getHTMLCellElement(x, y)));
    // this.lastSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(this.getHTMLCellElement(x, y)));
    // this.renameValue = this.settings.renameCols ?
    //   this.settings.columns[this.firstSelected.x] : this.renameValue = this.settings.renameRows ?
    //     this.settings.rows[this.firstSelected.y] : this.settings.data[this.firstSelected.y][this.firstSelected.x].value;
  }
}
