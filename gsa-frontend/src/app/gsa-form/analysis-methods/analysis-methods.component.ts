import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, delay, Observable} from "rxjs";
import {Method} from "../model/methods.model";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Handsontable from "handsontable";
import {CellValue} from "handsontable/common";
import {HotTableComponent, HotTableRegisterer} from "@handsontable/angular";

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss'],
  providers: [AnalysisMethodsService]
})
export class AnalysisMethodsComponent implements OnInit {
  methods$: Observable<Method[]>;
  name: string;
  frmStepOne: FormGroup;


  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.frmStepOne = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() : void{

    // this.form = this.formBuilder.group({
    //   name: ['', Validators.required]
    // });
    this.methods$ = this.methodService.getAnalysisMethods()
  }

  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild(HotTableComponent)
  table: HotTableComponent;
  private hotRegisterer = new HotTableRegisterer();
  ids = 'hotInstance';
  columns: string[] = ["name", "address"]
  rows: number[] = [1, 2, 3, 4, 5, 6, 7, 8,]

  dataset: CellValue[][] = [
    ['Ted Right', 'Wall Street'],
    ['Frank Honest', 'Pennsylvania Avenue'],
    ['Joan Well', 'Broadway'],
    ['Gail Polite', 'Bourbon Street'],
    ['Michael Fair', 'Lombard Street'],
    ['Mia Fair', 'Rodeo Drive'],
    ['Cora Fair', 'Sunset Boulevard'],
    ['Jack Right', 'Michigan Avenue'],
  ];

  flyingCoords: DOMRect;
  flyingVisible: boolean = false;
  flyingValue: string;
  modifiedColumnIndex: number;


  settings: Handsontable.GridSettings = {
    data: this.dataset,
    colHeaders: index => this.columns[index],
    rowHeaders: index => this.rows[index].toString(),
    allowInsertColumn: true,
    contextMenu: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation',
    afterOnCellMouseDown: (event, coords, th) => {
      if (coords.row === -1) {
        this.flyingVisible = true;
        this.flyingCoords = th.getBoundingClientRect();
        this.modifiedColumnIndex = coords.col;
        this.flyingValue = this.columns[this.modifiedColumnIndex];
        setTimeout(() => this.input.nativeElement.focus());
      }
    },
  };

  renameColumn() {
    this.columns[this.modifiedColumnIndex] = this.flyingValue;
    this.table.updateHotTable({colHeaders: this.columns});
    this.flyingVisible = false;
  }


  addColumn(index: number = -1) {
    if (index === -1) index = this.columns.length;
    this.columns.push("")
    this.dataset.forEach(value => value.push(""))
    this.rows.push(9)
    this.table.updateHotTable(this.settings)
    // this.hotRegisterer.getInstance(this.ids).selectCell(0, 0)
  }

  saveAnnotations() {
    console.log(this.dataset)
    console.log(this.columns)
  }
}
