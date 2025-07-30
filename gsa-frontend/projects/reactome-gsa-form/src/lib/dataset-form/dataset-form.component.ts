import {Component, OnDestroy, OnInit, input, viewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {MatDialog} from "@angular/material/dialog";
import {ScrollService} from "../services/scroll.service";
import {CdkStep, StepperSelectionEvent} from "@angular/cdk/stepper";
import {Store} from "@ngrx/store";
import {datasetFeature} from "../state/dataset/dataset.selector";
import {delay, distinctUntilChanged, Observable, share} from "rxjs";
import {PDataset} from "../state/dataset/dataset.state";
import {datasetActions} from "../state/dataset/dataset.actions";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Parameter} from "../model/parameter.model";
import {Method} from "../state/method/method.state";
import {DownloadDatasetService} from "../services/download-dataset.service";
import {TourUtilsService} from "../services/tour-utils.service";

@Component({
    selector: 'gsa-dataset-form',
    templateUrl: './dataset-form.component.html',
    styleUrls: ['./dataset-form.component.scss'],
    standalone: false
})
@UntilDestroy()
export class DatasetFormComponent implements OnInit, OnDestroy {
  readonly datasetId = input.required<number>();
  readonly method = input.required<Method>();

  public readonly stepper = viewChild.required<MatStepper>('nestedStepper');
  readonly selectStep = viewChild.required<CdkStep>('selectStep');
  readonly annotateStep = viewChild.required<CdkStep>('annotateStep');
  readonly statisticalDesignStep = viewChild.required<CdkStep>('statisticalDesignStep');


  dataset$: Observable<PDataset | undefined>;
  parameters$: Observable<Parameter[]>;
  summaryComplete$: Observable<boolean>;
  annotationComplete$: Observable<boolean>;
  statisticalDesignComplete$: Observable<boolean>;

  constructor(public dialog: MatDialog, public tour: TourUtilsService, public download: DownloadDatasetService,
              public scrollService: ScrollService, private store: Store) {
  }

  ngOnInit(): void {
    this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId()));
    this.parameters$ = this.store.select(datasetFeature.selectSummaryParameters(this.datasetId()));
    this.summaryComplete$ = this.store.select(datasetFeature.selectSummaryComplete(this.datasetId())).pipe(distinctUntilChanged(), share());
    this.summaryComplete$.pipe(delay(0), untilDestroyed(this)).subscribe(() => this.stepper().next());
    this.annotationComplete$ = this.store.select(datasetFeature.selectAnnotationComplete(this.datasetId())).pipe(distinctUntilChanged(), share());
    this.statisticalDesignComplete$ = this.store.select(datasetFeature.selectStatisticalDesignComplete(this.datasetId())).pipe(distinctUntilChanged(), share());
  }

  ngOnDestroy(): void {
    this.store.dispatch(datasetActions.delete({id: this.datasetId()}))
  }

  deleteDataset($event: MouseEvent) {
    $event.stopPropagation();
    this.store.dispatch(datasetActions.delete({id: this.datasetId()}))
  }

  saveData() {
    this.store.dispatch(datasetActions.save({id: this.datasetId()}))
  }

  changeParameters($event: Event) {
    $event.stopPropagation();
    this.store.dispatch(datasetActions.openSummaryParameters({id: this.datasetId()}))
  }

  updateScroll() {
    setTimeout(() => this.scrollService.triggerResize(), 300);
  }

  stepChange($event: StepperSelectionEvent) {
    switch ($event.selectedStep) {
      case this.selectStep():
        this.store.dispatch(datasetActions.clear({id: this.datasetId()}))
        break;
      case this.annotateStep():
        break;
      case this.statisticalDesignStep():
        break;
    }
  }
}
