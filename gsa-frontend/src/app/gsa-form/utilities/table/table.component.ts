import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CellInfo, Settings} from "../../model/table.model";

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
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  lastSelected: CellInfo
  selectedCells: SelectedCellRange
  renameVisible: boolean = false;
  renameValue: string;
  isDragging = false;
  modifiedCell: CellInfo;
  selectedCell: HTMLElement
  firstSelected: CellInfo;
  @Input() userSettings?: Settings;
  private defaultSettings: Settings = {
    columns: [],
    rows: [],
    data: [[new CellInfo()]],
    rename_cols: true,
    rename_rows: true,
    change_cells: true
  }
  settings: Settings

  constructor() {
  }

  ngOnInit(): void {
    this.firstSelected = new CellInfo(undefined, 0, 0)
    this.modifiedCell = new CellInfo(undefined, 0, 0)
    this.renameValue = this.settings.data[0][0].value
    this.settings = {...this.defaultSettings, ...this.userSettings}
    this.selectedCells = {
      maxX: 0, maxY: 0, minX: 0, minY: 0
    }
    this.lastSelected = new CellInfo(undefined, 0, 0)

  }

  ngAfterViewInit() {
    this.getCell(0, 0)?.classList.add('firstSelected')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings']) {
      this.settings = {...this.settings, ...this.userSettings}
    }
  }

  private getCell(x: number, y: number): HTMLTableCellElement {
    return this.rootRef.nativeElement.querySelector(`[x = '${x}'][y = '${y}']`) as HTMLTableCellElement;
  }

  mousedown($event: MouseEvent) {
    if (($event.target as HTMLElement).getAttribute("y") !== null) { //Don't do this when adding a column (Button does not have attribute y)
      this.renameCell()
      // $event.preventDefault()
      this.deselect()
      this.isDragging = true;
      this.getCell(-1, this.firstSelected.y)?.classList.remove('chosen-th')
      this.getCell(this.firstSelected.x, -1)?.classList.remove('chosen-th')
      let {x, y, parentElement} = this.extractCoordsFromEvent($event);
      this.firstSelected = new CellInfo(undefined, x, y)
      this.getCell(-1, y)?.classList.add('chosen-th')
      this.getCell(x, -1)?.classList.add('chosen-th')
      console.log(x, this.getCell(x, -1)?.classList)
      this.changeValueMouseClick($event)
    }
  }

  mousemove($event: MouseEvent) {
    if (this.isDragging) {
      this.deselect()
      let {x, y, parentElement} = this.extractCoordsFromEvent($event);
      this.lastSelected = new CellInfo(undefined, x, y)
      this.input.nativeElement.classList.add("selected")
      if (isNaN(this.lastSelected.x)) {
        this.input.nativeElement.classList.remove("selected")
      }
      let {minX, maxX, minY, maxY} = this.computeExtrema();
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          let parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");
          parentElement?.classList.add("selected");
          this.getCell(-1, y)?.classList.add('chosen-th')
          this.getCell(x, -1)?.classList.add('chosen-th')
        }
      }
    }
  }

  private computeExtrema() {
    let minX = Math.min(this.firstSelected.x, this.lastSelected.x)
    let maxX = Math.max(this.firstSelected.x, this.lastSelected.x)
    let minY = Math.min(this.firstSelected.y, this.lastSelected.y)
    let maxY = Math.max(this.firstSelected.y, this.lastSelected.y)
    return {minX, maxX, minY, maxY};
  }

  mouseup() {
    this.isDragging = false;
  }


  private extractCoordsFromEvent($event: MouseEvent): CellCoord {
    let x = parseInt(($event.target as HTMLTableCellElement).getAttribute("x") as string);
    let y = parseInt(($event.target as HTMLTableCellElement).getAttribute("y") as string);
    const parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");
    return {x, y, parentElement};
  }

  deselect() {
    let {minX, maxX, minY, maxY} = this.computeExtrema();
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        let parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");
        parentElement?.classList.remove("selected", "firstSelected")
        this.getCell(-1, y)?.classList.remove('chosen-th')
        this.getCell(x, -1)?.classList.remove('chosen-th')
      }
    }
  }

  focusOnCell(x: number, y: number) {
    const parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");
    this.modifiedCell = new CellInfo(undefined, x, y, this.getRelativeCoords(<HTMLElement>parentElement))
    this.firstSelected = this.modifiedCell
    this.showChangeInput()
  }

  addColumn() {
    this.settings.columns.push("Annotation" + (this.settings.columns.length + 1))
    this.settings.data.forEach((row) => row.push(new CellInfo()))
    setTimeout(() => this.focusOnCell(-1, this.settings.columns.length - 1));

  }

  changeValueMouseClick($event: MouseEvent) {
    $event.preventDefault()
    this.getCell(this.firstSelected.x, this.firstSelected.y)?.classList.remove('firstSelected')
    let cell = this.extractCoordsFromEvent($event);
    this.modifiedCell = new CellInfo(undefined, cell.x, cell.y, this.getRelativeCoords(cell.parentElement))
    this.firstSelected = this.modifiedCell
    this.showChangeInput()

  }

  showChangeInput() {
    let type: string = this.modifiedCell.x === -1 ? "col" : this.modifiedCell.y === -1 ? "row" : "cell";
    if (type === "col") { // It is a column
      this.renameValue = this.settings.columns[this.modifiedCell.y]
    } else if (type === "row") { // It is a row
      this.renameValue = this.settings.rows[this.modifiedCell.x]
    } else { // It is a cell
      this.renameValue = this.settings.data[this.modifiedCell.x][this.modifiedCell.y].value
    }
    if ((type === "col" && this.settings.rename_cols) || (type === "row" && this.settings.rename_rows) || (type === "cell" && this.settings.change_cells)) {
      this.renameVisible = true
      setTimeout(() => this.input.nativeElement.focus());
    }
  }

  getRelativeCoords(element: HTMLElement): DOMRect {
    let child = element.getBoundingClientRect();
    let parent = this.rootRef.nativeElement.getBoundingClientRect();
    child.x -= parent.x;
    child.y -= parent.y
    return child
  }


  renameCell() {
    if (this.modifiedCell.x === -1) { // It is a column
      this.settings.columns[this.modifiedCell.y] = this.renameValue
    } else if (this.modifiedCell.y === -1) { // It is a row
      this.settings.rows[this.modifiedCell.x] = this.renameValue
    } else { // It is a cell
      this.settings.data[this.modifiedCell.x][this.modifiedCell.y].value = this.renameValue
    }
    this.renameVisible = false;
  }

  deleteColumn($event: MouseEvent, y: number) {
    $event.preventDefault();
    $event.stopPropagation();
    this.settings.columns.splice(y, 1)
    this.settings.data.forEach((row) => {
      row.splice(y, 1)
    })
  }

  navigateTableDefault($event: KeyboardEvent) {
    $event.preventDefault()
    this.navigateTable($event)
  }

  navigateTable($event: KeyboardEvent) {
    this.renameCell()
    let x = this.firstSelected.x
    let y = this.firstSelected.y
    $event.preventDefault()
    this.getCell(-1, this.firstSelected.y)?.classList.remove('chosen-th')
    this.getCell(this.firstSelected.x, -1)?.classList.remove('chosen-th')
    if ($event.key == "ArrowRight") {
      y = y + 1 === this.settings.columns.length ? -1 : y + 1;
      if (this.settings.rename_rows === false && y === -1) y += 1
    } else if ($event.key == "ArrowLeft") {
      y = y - 1 === -2 ? this.settings.columns.length - 1 : y - 1
      if (this.settings.rename_rows === false && y === -1) y = this.settings.columns.length - 1
    } else if ($event.key == "ArrowUp") {
      if (x - 1 === -2) {
        x = this.settings.rows.length - 1
      } else {
        x = x - 1
      }
      if (this.settings.rename_cols === false && x === -1) x = this.settings.rows.length - 1
    } else if ($event.key == "ArrowDown") {
      x = x + 1 === this.settings.rows.length ? -1 : x + 1;
      if (this.settings.rename_cols === false && x === -1) x += 1
    } else if ($event.key == "Tab") {
      $event.preventDefault()
      if (x + 1 === this.settings.rows.length) {
        x = -1
        y = y + 1 === this.settings.columns.length ? -1 : y + 1;
      } else {
        x += 1
      }
      if (this.settings.rename_cols === false && x === -1) x += 1
      if (this.settings.rename_rows === false && y === -1) y += 1
    }
    if (this.settings.rename_rows === false && y === -1) {
      y += 1
    }
    if (this.settings.rename_cols === false && x === -1) {
      x += 1
    }
    this.firstSelected = new CellInfo(undefined, x, y)
    this.getCell(-1, y)?.classList.add('chosen-th')
    this.getCell(x, -1)?.classList.add('chosen-th')
    let parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']")
    this.modifiedCell = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement))
    this.showChangeInput()
  }

  navigateTableInput($event: any) {
    this.navigateTable($event)
  }

  pasteValues($event: ClipboardEvent) {
    $event.preventDefault()
    let pastedData = $event.clipboardData?.getData('text')
    let rows = pastedData?.split('\n')
    let pasteData: string[][] = []
    rows?.forEach(row => {
      pasteData.push(row.split('\t'))
    })
    let x = this.firstSelected.x
    let y_orig = this.firstSelected.y
    let y = y_orig
    pasteData.forEach((row, indexX) => {
      row.forEach((cell, indexY) => {
        this.settings.data[x + indexX][y + indexY].value = cell
      })
    })
    this.renameValue = pasteData[0][0]
  }

  deleteMarkedArea($event: any) {
    let {minX, maxX, minY, maxY} = this.computeExtrema();
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        this.settings.data[x][y].value = ""
      }
    }
    this.renameValue = ""
  }
}
