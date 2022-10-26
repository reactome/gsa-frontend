import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, delay, Observable} from "rxjs";
import {Method} from "../model/methods.model";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Handsontable from "handsontable";
import {CellValue} from "handsontable/common";
import {HotTableComponent, HotTableRegisterer} from "@handsontable/angular";
import {log, partial} from "handsontable/helpers";
import row from "ag-grid-enterprise/dist/lib/excelExport/files/xml/row";
import {CellInfo} from "../model/table.model";

type CellCoord = { x: number, y: number, parentElement: any };

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
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;
  @ViewChild('root') rootRef: ElementRef<HTMLDivElement>;


  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.frmStepOne = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    // this.form = this.formBuilder.group({
    //   name: ['', Validators.required]
    // });
    this.methods$ = this.methodService.getAnalysisMethods()
  }
}

