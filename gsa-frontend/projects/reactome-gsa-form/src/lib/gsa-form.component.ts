import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, viewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {Store} from "@ngrx/store";
import {methodFeature} from "./state/method/method.selector";
import {combineLatest, filter, firstValueFrom, map, Observable, take} from "rxjs";
import {datasetFeature} from "./state/dataset/dataset.selector";
import {datasetActions} from "./state/dataset/dataset.actions";
import {analysisActions} from "./state/analysis/analysis.actions";
import {Dataset} from "./state/dataset/dataset.state";
import {CdkStep, StepperSelectionEvent} from "@angular/cdk/stepper";
import {analysisFeature} from "./state/analysis/analysis.selector";
import {isDefined} from "./utilities/utils";
import {MatDialog} from "@angular/material/dialog";
import {CancelDialogComponent} from "./cancel-dialog/cancel-dialog.component";
import {TourUtilsService} from "./global-services/tour-utils.service";
import {HeightService} from "./global-services/height.service";

@Component({
    selector: 'gsa-form',
    templateUrl: './gsa-form.component.html',
    styleUrls: ['./gsa-form.component.scss'],
    standalone: false
})
export class GsaFormComponent implements AfterViewInit, OnInit, OnDestroy {
  readonly stepper = viewChild.required<MatStepper>('stepper');

  readonly setMethodStep = viewChild.required<CdkStep>('setMethodStep');
  readonly addDataStep = viewChild.required<CdkStep>('addDataStep');
  readonly optionStep = viewChild.required<CdkStep>('optionStep');
  readonly analysisStep = viewChild.required<CdkStep>('analysisStep');

  selectedMethod$ = this.store.select(methodFeature.selectSelectedMethod);
  methodSelected$ = this.selectedMethod$.pipe(map(method => method !== null))

  methodParameters$ = this.selectedMethod$.pipe(map(method => method?.parameters))
  commonParameters$ = this.store.select(methodFeature.selectCommonParameters);
  parameters$ = combineLatest([this.methodParameters$, this.commonParameters$]).pipe(map(([method, common]) => [...(method || []) , ...common]))
  reportRequired$ = this.commonParameters$.pipe(map(parameters => (parameters?.find(parameter => parameter.name === 'create_reports')?.value || false) as boolean))

  datasetIds$ = this.store.select(datasetFeature.selectIds) as Observable<number[]>;
  datasets$ = this.store.select(datasetFeature.selectAll) as Observable<Dataset[]>;
  allSaved$: Observable<boolean> = this.store.select(datasetFeature.selectAllSaved);
  analysisId$: Observable<string> = this.store.select(analysisFeature.selectAnalysisId).pipe(filter(isDefined));

  editable = true;

  constructor(private cdr: ChangeDetectorRef, private store: Store, public tour: TourUtilsService, public height: HeightService, private dialog: MatDialog) {
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
    this.analysisId$.pipe(take(1)).subscribe(analysisId => this.store.dispatch(analysisActions.cancel({analysisId})))
  }

  addDataset() {
    this.store.dispatch(datasetActions.add());
  }

  async stepChange($event: StepperSelectionEvent, vm: any) {
    switch ($event.selectedStep) {
      case this.setMethodStep():
        break;
      case this.addDataStep():
        break;
      case this.optionStep():
        this.store.dispatch(datasetActions.initAnnotationColumns())
        break;
      case this.analysisStep():
        this.store.dispatch(analysisActions.load(vm));
        this.editable = false;
        break;
    }
  }

  async cancel() {
    if (this.stepper().selected === this.analysisStep()) {
      const dialogRef = this.dialog.open(CancelDialogComponent, {autoFocus: '#cancel', role: "alertdialog"});
      const cancel = await firstValueFrom(dialogRef.afterClosed());
      if (cancel) {
        this.editable = true;
        setTimeout(() => this.stepper().previous());
        this.analysisId$.pipe(take(1)).subscribe(analysisId => this.store.dispatch(analysisActions.cancel({analysisId})))
      }
    }
  }

  restartAnalysis() {
    this.editable = true;
    setTimeout(() => this.stepper().selected = this.setMethodStep());
    this.analysisId$.pipe(take(1)).subscribe(analysisId => this.store.dispatch(analysisActions.cancel({analysisId})))
  }
}
