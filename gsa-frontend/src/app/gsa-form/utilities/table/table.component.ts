import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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

@Component({
  selector: 'gsa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  @ViewChild('addCol') columnButton: MatButton;

  lastSelected: CellInfo;
  selectedCells: SelectedCellRange;
  renameVisible: boolean = false
  renameValue: string;
  isDragging: boolean = false;
  firstSelected: CellInfo;
  @Input() userSettings?: Settings;
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

  constructor(private clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.lastSelected = new CellInfo(undefined, 0, 0);
    this.firstSelected = new CellInfo(undefined, 0, 0);
    this.firstSelected = new CellInfo(undefined, 0, 0);
    this.renameValue = this.settings.data[0][0].value;
    this.settings = {...this.defaultSettings, ...this.userSettings};
    this.selectedCells = {
      maxX: 0, maxY: 0, minX: 0, minY: 0
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings']) {
      this.settings = {...this.settings, ...this.userSettings};
    }
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
    this.showSelectedColsRows("add");
  }

  showSelectedColsRows(method: string) {
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
      this.showSelectedColsRows("add");
    }
  }

  mouseup() {
    this.isDragging = false;
  }

  deselect() {
    this.renameCell();
    this.showSelectedColsRows("remove");
    this.input?.nativeElement?.classList.remove("selected");
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
    console.log(this.firstSelected)
    let type: string = this.firstSelected.x === -1 ? "row" : this.firstSelected.y === -1 ? "col" : "cell";
    if (type === "col") { // It is a column
      this.renameValue = this.settings.columns[this.firstSelected.x];
    } else if (type === "row") { // It is a row
      this.renameValue = this.settings.rows[this.firstSelected.y];
    } else { // It is a cell
      this.renameValue = this.settings.data[this.firstSelected.y][this.firstSelected.x].value;
    }
    console.log(type, this.settings.renameRows)
    if ((type === "col" && this.settings.renameCols) || (type === "row" && this.settings.renameRows) || (type === "cell" && this.settings.changeCells)) {
      console.log("hier")
      this.renameVisible = true
      setTimeout(() => this.input.nativeElement.focus());
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
    this.settings.data.forEach((row) => {
      row.splice(y, 1);
    })
  }

  navigateTableDefault() {
  }

  move(x: number, y: number, direction: string): [number, number] {
    switch (direction) {
      case "right":
        x += 1
        break
      case "left":
        x -= 1
        break
      case "up":
        y -= 1
        break
      case "down":
        y += 1
        break
    }
    return [x, y]
  }

  columnEndExceeded(y: number): boolean {
    return y === this.settings.rows.length
  }

  rowEndExceeded(x: number): boolean {
    return x === this.settings.columns.length
  }

  columnBeginExceeded(y: number): boolean {
    return (y === -1 && this.settings.renameCols === false) || (y === -2)
  }

  rowBeginExceeded(x: number): boolean {
    return (x === -1 && this.settings.renameRows === false) || (x === -2);
  }

  computeExceeded(x: number, y: number): [number, number] {
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

  moveCell(x: number, y: number, direction: string): [number, number] {
    [x, y] = this.move(x, y, direction);
    [x, y] = this.computeExceeded(x, y);
    return [x, y]
  }

  focusOnButton(x: number, y: number): boolean {
    if (this.rowEndExceeded(x + 1) && this.columnEndExceeded(y + 1) || this.rowBeginExceeded(x - 1) && this.columnBeginExceeded(y - 1)) {
      setTimeout(() => this.columnButton.focus());
      return true
    }
    return false
  }

  navigateTable($event: KeyboardEvent) {
    $event.preventDefault();

    this.deselect();

    let x = this.firstSelected.x;
    let y = this.firstSelected.y;
    switch ($event.key) {


      case "ArrowRight":
        [x, y] = this.moveCell(x, y, "right")
        break
      case "ArrowLeft":
        [x, y] = this.moveCell(x, y, "left")
        break
      case "ArrowUp":
        [x, y] = this.moveCell(x, y, "up")
        break
      case "ArrowDown":
        [x, y] = this.moveCell(x, y, "down")
        break
      case "Tab":
        if (!$event.shiftKey) {
          if (this.focusOnButton(x, y)) return
          [x, y] = this.moveCell(x, y, "down");
          if (y === -1 || y === 0 && this.settings.renameCols === false) {
            x += 1
          }
          break
        } else {
          if (this.focusOnButton(x, y)) return
          [x, y] = this.moveCell(x, y, "up");
          if (y === this.settings.rows.length - 1) {
            x -= 1;
          }
          break
        }
      case "Enter":
        [x, y] = this.moveCell(x, y, "down");

    }
    let parentElement = this.getHTMLCellElement(x, y);
    this.firstSelected = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement));
    this.lastSelected = new CellInfo(undefined, x, y);
    this.showSelectedColsRows("add")
    this.showChangeInput();
  }

  navigateTableInput($event: any) {
    this.navigateTable($event)
  }

  pasteValues($event: ClipboardEvent) {
    $event.preventDefault()
    let pastedData: string = $event.clipboardData?.getData('text') as string
    let rows: string[] = pastedData?.split('\n')
    let pasteData: string[][] = rows.map(row => row.split('\t'))

    let x = this.firstSelected.x
    let y = this.firstSelected.y
    this.renameValue = pasteData[0][0]
    pasteData.forEach((row, indexX) => {
      row.forEach((cell, indexY) => {
        this.settings.data[y + indexY][x + indexX].value = cell
      })
    })
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
        copyText += this.settings.data[y][x].value
        if (y < maxY) {
          copyText += "\t"
        }
      }
      if (x < maxX) {
        copyText += "\n"
      }
    }
    this.clipboard.copy(copyText)
  }

  getHTMLCellElement(x: number, y: number):
    HTMLTableCellElement {
    return this.rootRef.nativeElement.querySelector(`[x = '${x}'][y = '${y}']`) as HTMLTableCellElement;
  }

  computeRange() {
    let minX = Math.min(this.firstSelected.x, this.lastSelected.x);
    let maxX = Math.max(this.firstSelected.x, this.lastSelected.x);
    let minY = Math.min(this.firstSelected.y, this.lastSelected.y);
    let maxY = Math.max(this.firstSelected.y, this.lastSelected.y);
    return {minX, maxX, minY, maxY};
  }

  getCell($event: MouseEvent): CellCoord {
    let x = parseInt(($event.target as HTMLTableCellElement).getAttribute("x") as string);
    let y = parseInt(($event.target as HTMLTableCellElement).getAttribute("y") as string);
    const parentElement = this.getHTMLCellElement(x, y);
    return {x, y, parentElement};
  }
}
