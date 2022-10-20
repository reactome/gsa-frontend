import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import Handsontable from "handsontable";
import {CellValue} from "handsontable/common";
import {HotTableComponent} from "@handsontable/angular";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {
  form: FormGroup;


  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild(HotTableComponent)
  table: HotTableComponent;
  columns: string[] = []
  rows: string[] = []
  dataset: CellValue[][] = []
  renameCoords: DOMRect;
  renameVisible: boolean = false;
  renameValue: string;
  modifiedColumnIndex: number;
  settings: Handsontable.GridSettings = {
    data: this.dataset,
    colHeaders: index => this.columns[index],
    rowHeaders: index => this.rows[index],
    allowInsertColumn: true,
    manualColumnResize: true,
    rowHeaderWidth: 130,
    stretchH: 'all',
    contextMenu: true,
    height: 'auto',
    // licenseKey: 'non-commercial-and-evaluation',
    afterOnCellMouseDown: (event, coords, th) => {
      if (coords.row === -1) {
        this.renameVisible = true;
        console.log(this.renameCoords)
        this.renameCoords = th.getBoundingClientRect();
        this.modifiedColumnIndex = coords.col;
        this.renameValue = this.columns[this.modifiedColumnIndex];
        setTimeout(() => this.input.nativeElement.focus());
      }
    },
  };

  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.dataset = this.loadDataService.dataset
    this.rows = this.loadDataService.rows
    this.columns = this.loadDataService.columns
    console.log(this.dataset)
    console.log(this.rows)
    console.log(this.columns)
  }

  renameColumn() {
    this.columns[this.modifiedColumnIndex] = this.renameValue;
    this.table.updateHotTable({colHeaders: this.columns});
    this.renameVisible = false;
  }


  addColumn(index: number = -1) {
    if (index === -1) index = this.columns.length;
    this.columns.push("")
    this.dataset.forEach(value => value.push(""))
    this.table.updateHotTable(this.settings)
  }
}
