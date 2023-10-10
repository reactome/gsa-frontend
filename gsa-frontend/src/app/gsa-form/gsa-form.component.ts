import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {Store} from "@ngrx/store";
import {methodFeature} from "./state/method/method.selector";
import {filter, map, Observable, take} from "rxjs";
import {datasetFeature} from "./state/dataset/dataset.selector";
import {datasetActions} from "./state/dataset/dataset.actions";
import {analysisActions} from "./state/analysis/analysis.actions";
import {Dataset} from "./state/dataset/dataset.state";
import {CdkStep, StepperSelectionEvent} from "@angular/cdk/stepper";
import {analysisFeature} from "./state/analysis/analysis.selector";
import {isDefined} from "./utilities/utils";
import {HeightService} from "../services/height.service";
import {TourUtilsService} from "../services/tour-utils.service";


@Component({
  selector: 'gsa-form',
  templateUrl: './gsa-form.component.html',
  styleUrls: ['./gsa-form.component.scss']
})
export class GsaFormComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;

  @ViewChild('setMethodStep') setMethodStep: CdkStep;
  @ViewChild('addDataStep') addDataStep: CdkStep;
  @ViewChild('optionStep') optionStep: CdkStep;
  @ViewChild('analysisStep') analysisStep: CdkStep;

  selectedMethod$ = this.store.select(methodFeature.selectSelectedMethod);
  methodSelected$ = this.selectedMethod$.pipe(map(method => method !== null))

  methodParameters$ = this.selectedMethod$.pipe(map(method => method?.parameters))
  reportRequired$ = this.methodParameters$.pipe(map(parameters => (parameters?.find(parameter => parameter.name === 'create_reports')?.value || false) as boolean))
  datasetIds$ = this.store.select(datasetFeature.selectIds) as Observable<number[]>;
  datasets$ = this.store.select(datasetFeature.selectAll) as Observable<Dataset[]>;
  allSaved$: Observable<boolean> = this.store.select(datasetFeature.selectAllSaved);
  analysisId$: Observable<string> = this.store.select(analysisFeature.selectAnalysisId).pipe(filter(isDefined));

  constructor(private cdr: ChangeDetectorRef, private store: Store, public tour: TourUtilsService, public height: HeightService) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.datasets$
      .pipe(take(1))
      .subscribe(datasets => datasets.length === 0 ? this.addDataset() : null)
  }

  ngOnDestroy(): void {
    this.cancelAnalysis()
  }

  addDataset() {
    this.store.dispatch(datasetActions.add());
  }

  stepChange($event: StepperSelectionEvent, vm: any) {
    switch ($event.selectedStep) {
      case this.setMethodStep:
        break;
      case this.addDataStep:
        break;
      case this.optionStep:
        this.store.dispatch(datasetActions.initAnnotationColumns())
        break;
      case this.analysisStep:
        this.store.dispatch(analysisActions.load(vm))
        break;
    }

    if ($event.previouslySelectedStep === this.analysisStep) {
      this.cancelAnalysis();
    }
  }

  private cancelAnalysis() {
    this.analysisId$.pipe(take(1)).subscribe(analysisId => this.store.dispatch(analysisActions.cancel({analysisId})))
  }
}
