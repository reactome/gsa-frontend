import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CellInfo, Settings} from "../../model/table.model";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatButton} from "@angular/material/button";
import row from "ag-grid-enterprise/dist/lib/excelExport/files/xml/row";


type CellCoord = { x: number, y: number, parentElement: any };

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
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  @ViewChild('addCol') columnButton: MatButton;
  lastSelected: CellInfo;
  renameVisible: boolean = false
  renameValue: string;
  isDragging: boolean = false;
  firstSelected: CellInfo;
  @Input() userSettings: Settings;
  settings: Settings;
  private defaultSettings: Settings = {
    columns: [],
    rows: [],
    data: [[new CellInfo()]],
    renameCols: true,
    renameRows: true,
    changeCells: true,
    addColumnButton: true,
    showRows: true,
    showCols: true
  };
  private moveObj: { [dir in Direction]: (coord: Coord) => Coord } = {
    right: ([x, y]) => [x + 1, y],
    left: ([x, y]) => [x - 1, y],
    up: ([x, y]) => [x, y - 1],
    down: ([x, y]) => [x, y + 1]
  }

  constructor(private clipboard: Clipboard, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.settings = {...this.defaultSettings, ...this.userSettings};
    // Define coordinate for input field
    this.firstSelected = new CellInfo(undefined, 0, 0);
    this.lastSelected = new CellInfo(undefined, 0, 0);
    this.renameValue = this.settings.data[0][0].value;
  }

  ngAfterViewInit() {
    // Now we can find the HTML elements since they are initialised
    this.firstSelected = new CellInfo(undefined, 0, 0, this.getRelativeCoords(this.getHTMLCellElement(0, 0)));
    this.lastSelected = new CellInfo(undefined, 0, 0);
    this.renameValue = this.settings.data[0][0].value;
    this.cd.detectChanges()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings']) this.settings = {...this.settings, ...this.userSettings};
  }

  mousedown($event: MouseEvent) {
    // ($event.target as HTMLElement).getAttribute("x") !== null
    if (($event.target as HTMLElement).getAttribute("x") !== null) { //Don't do this when adding a column (Button does not have attribute y)
      this.deselect();
      this.isDragging = true;
      let {x, y} = this.getCell($event);
      this.selectCell(x, y);
      this.changeValue($event);
    }
  }

  selectCell(x: number, y: number) {
    this.firstSelected = new CellInfo(undefined, x, y);
    this.lastSelected = new CellInfo(undefined, x, y);
    this.showSelected("add");
  }

  showSelected(method: string) {
    let {minX, maxX, minY, maxY} = this.computeRange();
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let parentElement = this.getHTMLCellElement(x, y);
        switch (method) {
          case "add":
            parentElement?.classList.add("selected");
            this.getHTMLCellElement(-1, y)?.classList.add('chosen-th');
            this.getHTMLCellElement(x, -1)?.classList.add('chosen-th');
            break
          case "remove":
            parentElement?.classList.remove("selected");
            this.getHTMLCellElement(-1, y)?.classList.remove('chosen-th');
            this.getHTMLCellElement(x, -1)?.classList.remove('chosen-th');
            break
        }

      }
    }
  }

  mousemove($event: MouseEvent) {
    if (this.isDragging) {
      this.deselect();
      let {x, y} = this.getCell($event);
      if (isNaN(x) && isNaN(y)) { // Cell is the same as first selected cell
        this.lastSelected = new CellInfo(undefined, this.firstSelected.x, this.firstSelected.y);
      } else {
        this.input.nativeElement.classList.add("selected");
        this.lastSelected = new CellInfo(undefined, x, y);
      }
      this.showSelected("add");
    }
  }

  mouseup() {
    this.isDragging = false;
  }

  deselect() {
    this.renameCell();
    this.showSelected("remove");
    this.input?.nativeElement?.classList.remove("selected");
    this.lastSelected = this.firstSelected
  }

  focusOnCell(x: number, y: number) {
    const parentElement = this.getHTMLCellElement(x, y);
    this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(<HTMLElement>parentElement));
    this.showChangeInput();
  }

  addColumn() {
    this.deselect();
    this.settings.columns.push("Annotation" + (this.settings.columns.length + 1));
    this.settings.data.forEach((row) => row.push(new CellInfo()));
    setTimeout(() => this.focusOnCell(this.settings.columns.length - 1, -1));
    this.firstSelected = new CellInfo(undefined, this.settings.columns.length - 1, -1)
    this.lastSelected = new CellInfo(undefined, this.settings.columns.length - 1, -1)

  }

  changeValue($event: MouseEvent) {
    $event.preventDefault();
    let cell = this.getCell($event);
    this.firstSelected = new CellInfo(undefined, cell.x, cell.y, this.getRelativeCoords(cell.parentElement));
    this.showChangeInput();
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
    let type: string = this.firstSelected.x === -1 ? "row" : this.firstSelected.y === -1 ? "col" : "cell";
    if (type === "col") { // It is a column
      this.renameValue = this.settings.columns[this.firstSelected.x];
    } else if (type === "row") { // It is a row
      this.renameValue = this.settings.rows[this.firstSelected.y];
    } else { // It is a cell
      this.renameValue = this.settings.data[this.firstSelected.y][this.firstSelected.x].value;
    }
    if ((type === "col" && this.settings.renameCols) || (type === "row" && this.settings.renameRows) || (type === "cell" && this.settings.changeCells)) {
      this.renameVisible = true
      setTimeout(() => {
        this.input.nativeElement.focus();
        this.input.nativeElement.scrollIntoView({block: "nearest", inline: "nearest", behavior: 'smooth'});
        // window.scrollBy(0, 0)
      });
    } else {

      this.renameVisible = false
    }
  }

  renameCell() {
    if (this.firstSelected.x === -1) { // It is a column
      this.settings.columns[this.firstSelected.x] = this.renameValue;
    } else if (this.firstSelected.y === -1) { // It is a row
      this.settings.rows[this.firstSelected.y] = this.renameValue;
    } else { // It is a cell
      this.settings.data[this.firstSelected.y][this.firstSelected.x].value = this.renameValue;
    }
  }

  deleteColumn($event: MouseEvent, y: number) {
    $event.preventDefault();
    $event.stopPropagation();
    this.settings.columns.splice(y, 1);
    this.settings.data.forEach((row) => row.splice(y, 1));
    this.renameVisible = false;
  }

  navigateTableDefault() {
  }

  move(x: number, y: number, direction: Direction): Coord {
    return this.moveObj[direction]([x, y])
  }

  columnEndExceeded(y: number): boolean {
    return y === this.settings.rows.length
  }

  rowEndExceeded(x: number): boolean {
    return x === this.settings.columns.length
  }

  columnBeginExceeded(y: number): boolean {
    return (y === -1 && !this.settings.renameCols) || (y === -2)
  }

  rowBeginExceeded(x: number): boolean {
    return (x === -1 && !this.settings.renameRows) || (x === -2);
  }

  computeExceeded(x: number, y: number): Coord {
    if (this.columnEndExceeded(y)) {
      y = this.settings.renameCols ? -1 : 0;
    }
    if (this.columnBeginExceeded(y)) {
      y = this.settings.rows.length - 1;
    }
    if (this.rowEndExceeded(x)) {
      x = this.settings.renameRows ? -1 : 0;
    }
    if (this.rowBeginExceeded(x)) {
      x = this.settings.columns.length - 1;
    }
    return [x, y];
  }

  moveCell(x: number, y: number, direction: Direction): Coord {
    [x, y] = this.move(x, y, direction);
    [x, y] = this.computeExceeded(x, y);
    return [x, y];
  }

  findPreviousTabStop(element: HTMLElement) {
    var universe = document.querySelectorAll('input, button, select, textarea, a[href]');
    var list = Array.prototype.filter.call(universe, function (item) {
      return item.tabIndex >= "0"
    });
    var index = list.indexOf(element);
    return list[index - 1] || list[0];
  }

  unfocusTable(x: number, y: number): boolean {
    if (this.rowEndExceeded(x + 1) && this.columnEndExceeded(y + 1)) {
      this.renameVisible = false;
      setTimeout(() => this.columnButton.focus());
      return true
    } else if (this.rowBeginExceeded(x - 1) && this.columnBeginExceeded(y - 1)) {
      this.blurInput();
      setTimeout(() => this.input.nativeElement.blur());
      var nextEl = this.findPreviousTabStop(this.input.nativeElement);
      nextEl.focus();
      return true
    }
    return false
  }


  navigateTable($event: KeyboardEvent): void {
    let x = this.lastSelected.x;
    let y = this.lastSelected.y;

    const keyToAction: Map<string, () => Coord> = new Map<string, () => Coord>([
      ["ArrowRight", () => this.moveCell(x, y, "right")],
      ["ArrowLeft", () => this.moveCell(x, y, "left")],
      ["ArrowUp", () => this.moveCell(x, y, "up")],
      ["ArrowDown", () => this.moveCell(x, y, "down")],
      ["Enter", () => this.moveCell(x, y, "down")],
      ["Tab", () => {
        if ($event.shiftKey) {
          if (this.unfocusTable(x, y)) return [-1, -1];
          [x, y] = this.moveCell(x, y, "up");
          if (y === this.settings.rows.length - 1) x -= 1;
          return [x, y];
        } else {
          if (this.unfocusTable(x, y)) return [-1, -1];

          // this.unfocusTable(x, y);
          [x, y] = this.moveCell(x, y, "down");
          if ((y === -1) || (y === 0 && !this.settings.renameCols)) x += 1;
          return [x, y];
        }
      }],
    ]);

    const action = keyToAction.get($event.key);
    if (action) {
      $event.preventDefault();
      let [x, y] = action();
      if (x === -1 && y === -1) return
      if ((!$event.shiftKey) || ($event.shiftKey && $event.key === 'Tab')) {
        [x, y] = [this.firstSelected.x + (x - this.lastSelected.x), this.firstSelected.y + (y - this.lastSelected.y)]
      }
      let parentElement = this.getHTMLCellElement(x, y);
      this.deselect();
      this.input.nativeElement.classList.add("selected");

      setTimeout(() => {
        if ((!$event.shiftKey) || ($event.shiftKey && $event.key === 'Tab')) {
          this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
          this.input.nativeElement.classList.remove("selected");

        }
        this.lastSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));

        this.showSelected("add")
        this.showChangeInput();
      }, 0);

    }
  }

  navigateTableInput($event: any) {
    this.navigateTable($event)
  }

  pasteValues($event: ClipboardEvent) {
    $event.preventDefault();
    let pastedData: string = $event.clipboardData?.getData('text') as string;
    let rows: string[] = pastedData?.split('\n');
    let pasteData: string[][] = rows.map(row => row.split('\t'));

    let x = this.firstSelected.x;
    let y = this.firstSelected.y;
    this.renameValue = pasteData[0][0];
    pasteData.forEach((row, indexX) => {
      row.forEach((cell, indexY) => {
        this.settings.data[y + indexY][x + indexX].value = cell;
      })
    })
    setTimeout(() => {
      const firstSelectedHTML = this.getHTMLCellElement(x, y);
      this.firstSelected.coordinate = this.getRelativeCoords(firstSelectedHTML);
      this.showChangeInput()
    }, 0);

  }

  deleteSelectedArea() {
    let {minX, maxX, minY, maxY} = this.computeRange();
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        this.settings.data[y][x].value = ""
      }
    }
    this.renameValue = ""
  }

  copyValues() {
    let copyText: string = ""
    let {minX, maxX, minY, maxY} = this.computeRange();
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        copyText += this.settings.data[y][x].value;
        if (y < maxY) copyText += "\t";
      }
      if (x < maxX) copyText += "\n";
    }
    let temp = this.firstSelected
    this.clipboard.copy(copyText)
    this.firstSelected = temp
  }

  getHTMLCellElement(x: number, y: number):
    HTMLTableCellElement {
    return this.rootRef.nativeElement.querySelector(`[x = '${x}'][y = '${y}']`) as HTMLTableCellElement;
  }

  computeRange() {
    const minX = Math.min(this.firstSelected.x, this.lastSelected.x);
    const maxX = Math.max(this.firstSelected.x, this.lastSelected.x);
    const minY = Math.min(this.firstSelected.y, this.lastSelected.y);
    const maxY = Math.max(this.firstSelected.y, this.lastSelected.y);
    return {minX, maxX, minY, maxY};
  }

  getCell($event: MouseEvent):
    CellCoord {
    let x = parseInt(($event.target as HTMLTableCellElement).getAttribute("x") as string);
    let y = parseInt(($event.target as HTMLTableCellElement).getAttribute("y") as string);
    const parentElement = this.getHTMLCellElement(x, y);
    return {x, y, parentElement};
  }

  isCell(): boolean {
    return this.firstSelected.x === -1 ? false : this.firstSelected.y === -1 ? false : true;
  }

  blurInput() {
    this.renameVisible = false
    this.renameCell()
    this.deselect()
    this.firstSelected = new CellInfo(undefined, 0, 0, this.getRelativeCoords(this.getHTMLCellElement(0, 0)));
    this.lastSelected = new CellInfo(undefined, 0, 0, this.getRelativeCoords(this.getHTMLCellElement(0, 0)));
    this.renameValue = this.settings.data[0][0].value;
  }
}
