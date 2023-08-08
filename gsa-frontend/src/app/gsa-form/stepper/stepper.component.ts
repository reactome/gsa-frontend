import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {AnalysisService} from "../services/analysis.service";
import {MatStepper} from "@angular/material/stepper";
import {Store} from "@ngrx/store";
import {methodFeature} from "../state/method/method.selector";
import {map, Observable} from "rxjs";
import {datasetFeature} from "../state/dataset/dataset.selector";
import {datasetActions} from "../state/dataset/dataset.actions";


@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit, OnInit {
  @ViewChild('stepper') stepper: MatStepper;

  methodSelected$ = this.store.select(methodFeature.selectSelectedMethodName).pipe(map(name => name !== null))

  datasetIds$ = this.store.select(datasetFeature.selectIds) as Observable<number[]>;
  constructor(private cdr: ChangeDetectorRef, public analysisMethodsService: AnalysisMethodsService, public analysisService: AnalysisService, private store: Store) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.addDataset();
  }

  addDataset() {
    this.store.dispatch(datasetActions.add())
  }

}
