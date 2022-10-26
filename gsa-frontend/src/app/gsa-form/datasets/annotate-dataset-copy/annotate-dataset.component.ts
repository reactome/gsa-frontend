import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {CellInfo, Settings} from "../../model/table.model";

type CellCoord = { x: number, y: number, parentElement: any };
@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;
  frmStepThree: FormGroup;
  selectedCells: string[] = [];
  firstSelected: string = ''
  renameVisible: boolean = false;
  renameValue: string;
  isDragging = false;
  modifiedCell: CellInfo
  settings: Settings = {
    columns: this.loadDataService.columns,
    rows: this.loadDataService.rows,
    data: this.loadDataService.dataset,
    rename_rows: false
  }


  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService) {
    this.frmStepThree = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }


  mousedown($event: MouseEvent) {
    //Don't select text when dragging
    let {x, y, parentElement} = this.extractCoordsFromEvent($event);
    // parentElement?.classList.add("selected");
    this.deselect()
    this.firstSelected = `(${x}, ${y})`
    document.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']")?.classList.add('firstSelected')
    this.selectedCells = [`(${x}, ${y})`];
    this.isDragging = true;
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

    const parentElement = document.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']");


    return {x, y, parentElement};
  }

  deselect() {
    for (let cell of this.selectedCells) {
      let x = cell.substring(cell.indexOf('(') + 1, cell.indexOf(","));
      let y = cell.substring(cell.indexOf(',') + 2, cell.indexOf(")"));
      const parentElement = document.querySelector("[x = \'" + x?.toString() + "\'][y = \'" + y?.toString() + "\']")
      parentElement?.classList.remove("selected", "firstSelected")
    }
  }

  addColumn() {
    this.loadDataService.columns.push("")
    this.loadDataService.dataset.forEach((row) => row.push(new CellInfo()))
  }

  changeValue($event: MouseEvent) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let cellCoord = this.extractCoordsFromEvent($event);
    this.modifiedCell = new CellInfo(undefined, cellCoord.x, cellCoord.y, this.getRelativeCoords(cellCoord.parentElement))
    this.renameVisible = true
    if (this.modifiedCell.x === -1) { // It is a column
      this.renameValue = this.loadDataService.columns[this.modifiedCell.y]
    }
    else if (this.modifiedCell.y === -1) { // It is a row
      this.renameValue = this.loadDataService.rows[this.modifiedCell.x]
    }
    else { // It is a cell
      this.renameValue = this.loadDataService.dataset[this.modifiedCell.x][this.modifiedCell.y].value
    }
    setTimeout(() => this.input.nativeElement.focus());
    return {offsetTop: offsetTop, offsetLeft: offsetLeft}
  }

  getRelativeCoords(element: HTMLElement): DOMRect {
    let child = element.getBoundingClientRect();
    let parent = this.rootRef.nativeElement.getBoundingClientRect();
    let row = element.parentElement?.parentElement?.parentElement?.getBoundingClientRect() as DOMRect
    child.x -=  parent.x;
    child.y -=   parent.y
    return child
  }


  renameCell() {
    if (this.modifiedCell.x === -1) { // It is a column
      this.loadDataService.columns[this.modifiedCell.y] = this.renameValue
    }
    else if (this.modifiedCell.y === -1) { // It is a row
      this.loadDataService.rows[this.modifiedCell.x] = this.renameValue
    }
    else { // It is a cell
      this.loadDataService.dataset[this.modifiedCell.x][this.modifiedCell.y].value = this.renameValue
    }
    this.renameVisible = false;
  }

}
