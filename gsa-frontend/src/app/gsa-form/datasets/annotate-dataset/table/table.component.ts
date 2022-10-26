import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CellInfo, Settings} from "../../../model/table.model";
import {MatIcon} from "@angular/material/icon";
import {log} from "handsontable/helpers";

type CellCoord = { x: number, y: number, parentElement: any };

@Component({
  selector: 'gsa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  selectedCells: string[] = [];
  renameVisible: boolean = false;
  renameValue: string;
  isDragging = false;
  modifiedCell: CellInfo;
  selectedCell : HTMLElement
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
    this.settings = {...this.defaultSettings, ...this.userSettings}

  }

  ngAfterViewInit() {
    this.getCell(0, 0)?.classList.add('firstSelected')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSettings']) {
      this.settings = {...this.settings, ...this.userSettings }
    }
  }

  mousedown($event: MouseEvent) {
    this.getCell(this.firstSelected.x, this.firstSelected.y)?.classList.remove('firstSelected')
    //Don't select text when dragging
    let {x, y, parentElement} = this.extractCoordsFromEvent($event);
    // parentElement?.classList.add("selected");
    this.deselect()
    this.firstSelected = new CellInfo(undefined, x, y)
    this.getCell(x, y)?.classList.add('firstSelected')
    this.selectedCells = [`(${x}, ${y})`];
    this.isDragging = true;
  }

  private getCell(x: number, y: number): HTMLTableCellElement {
    return this.rootRef.nativeElement.querySelector(`[x = '${x}'][y = '${y}']`) as HTMLTableCellElement;
  }

  mousemove($event: MouseEvent) {
    if (this.isDragging) {
      let {x, y, parentElement} = this.extractCoordsFromEvent($event);
      parentElement?.classList.add("selected");
      this.selectedCells.push(`(${x}, ${y})`)
    }
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
    for (let cell of this.selectedCells) {
      let x = cell.substring(cell.indexOf('(') + 1, cell.indexOf(","));
      let y = cell.substring(cell.indexOf(',') + 2, cell.indexOf(")"));
      const parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']")
      parentElement?.classList.remove("selected", "firstSelected")
    }
  }

  addColumn() {
    this.settings.columns.push("")
    this.settings.data.forEach((row) => row.push(new CellInfo()))
  }

  changeValueMouseClick($event: MouseEvent) {
    console.log(this.firstSelected)
    this.getCell(this.firstSelected.x, this.firstSelected.y)?.classList.remove('firstSelected')
    let cellCoord = this.extractCoordsFromEvent($event);
    this.modifiedCell = new CellInfo(undefined, cellCoord.x, cellCoord.y, this.getRelativeCoords(cellCoord.parentElement))
    this.firstSelected = this.modifiedCell
    this.changeValue()
  }

  changeValue() {
    let type: string = this.modifiedCell.x === -1 ? "col" : this.modifiedCell.y === -1 ? "row" : "cell";
    if (type === "col") { // It is a column
      this.renameValue = this.settings.columns[this.modifiedCell.y]
    } else if (type === "row") { // It is a row
      this.renameValue = this.settings.rows[this.modifiedCell.x]
    } else  { // It is a cell
      this.renameValue = this.settings.data[this.modifiedCell.x][this.modifiedCell.y].value
    }
    console.log(type)
    if ((type === "col" && this.settings.rename_cols) || (type === "row" && this.settings.rename_rows) || (type === "cell" && this.settings.change_cells)) {
      this.renameVisible = true
      setTimeout(() => this.input.nativeElement.focus());
    }
  }

  getRelativeCoords(element: HTMLElement): DOMRect {
    let child = element.getBoundingClientRect();
    let parent = this.rootRef.nativeElement.getBoundingClientRect();
    let row = element.parentElement?.parentElement?.parentElement?.getBoundingClientRect() as DOMRect
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
    let x = this.firstSelected.x
    let y = this.firstSelected.y

    this.getCell(x, y)?.classList.remove('firstSelected')
    if ($event.key == "ArrowRight") {
      y = y + 1 === this.settings.columns.length ? -1 : y + 1;
    }
    else if ($event.key == "ArrowLeft") {
      y = y - 1 === -2 ? this.settings.columns.length - 1 : y - 1
    }
    else if ($event.key == "ArrowUp") {
      x = x - 1 === -2 ? this.settings.rows.length - 1 : x - 1
    }
    else if ($event.key == "ArrowDown") {
      x = x + 1 === this.settings.rows.length ? -1 : x + 1;
    }
    else if ($event.key == "Tab") {
      if (x + 1 === this.settings.rows.length) {
        x = -1
        y = y + 1 === this.settings.columns.length ? -1 : y + 1;
      }
      else {
        x += 1
      }
    }
    else if ($event.key == "Enter") {

    }

    this.getCell(x, y)?.classList.add('firstSelected')
    this.firstSelected = new CellInfo(undefined, x, y)
    let parentElement = this.rootRef.nativeElement.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");
    this.modifiedCell = new CellInfo(undefined, x, y, this.getRelativeCoords(parentElement as HTMLElement))
    this.changeValue()
  }
}
