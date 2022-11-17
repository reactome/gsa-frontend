import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CellInfo, Settings} from "../model/table.model";
import {LoadDatasetService} from "../services/load-dataset.service";

type CellCoord = { x: number, y: number, parentElement: any };

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss']
})
export class AnalysisMethodsComponent implements OnInit {
  name: string;
  frmStepOne: FormGroup;
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;


  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.frmStepOne = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  // ngOnInit(): void {
  //   this.methodService.getAnalysisMethods()
  // }

  settings: Settings
  columns: string[] = [
    "cell.type",
    "cell.group",
  ]
  rows: string[] = [
    "cluster 1",
    "cluster 2",
    "cluster 3",
    "cluster 4",
    "cluster 5",
    "cluster 6",
    "cluster 7",
    "cluster 8",
    "cluster 9",
    "cluster 10",
    "cluster 11",
    "cluster 12",
    "cluster 13"
  ]
  dataset: CellInfo[][] = [
    [new CellInfo("Memory 0"), new CellInfo("Normal 0")],
    [new CellInfo("Memory 1"), new CellInfo("Normal 1")],
    [new CellInfo("Memory 2"), new CellInfo("Normal 2")],
    [new CellInfo("Memory 3"), new CellInfo("Normal 3")],
    [new CellInfo("Memory 4"), new CellInfo("Normal 4")],
    [new CellInfo("Memory 5"), new CellInfo("Normal 5")],
    [new CellInfo("Memory 6"), new CellInfo("Normal 6")],
    [new CellInfo("Memory 7"), new CellInfo("Normal 7")],
    [new CellInfo("Memory 8"), new CellInfo("Normal 8")],
    [new CellInfo("Memory 9"), new CellInfo("Normal 9")],
    [new CellInfo("Memory 0"), new CellInfo("Normal 0")],
    [new CellInfo("Memory 1"), new CellInfo("Normal 1")],
    [new CellInfo("Memory 2"), new CellInfo("Normal 2")],
  ]

  ngOnInit() {
    this.settings = {
      columns: this.columns,
      rows: this.rows,
      data: this.dataset,
      rename_rows: false
    }
  }

  debug() {

  }
}

