import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {MatDialog} from "@angular/material/dialog";
import {ScrollService} from "../../services/scroll.service";
import {CdkStep, StepperSelectionEvent} from "@angular/cdk/stepper";
import {Store} from "@ngrx/store";
import {datasetFeature} from "../../state/dataset/dataset.selector";
import {delay, distinctUntilChanged, Observable, of, share} from "rxjs";
import {PDataset} from "../../state/dataset/dataset.state";
import {datasetActions} from "../../state/dataset/dataset.actions";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Parameter} from "../../state/parameter/parameter.state";

@Component({
  selector: 'gsa-nested-stepper',
  templateUrl: './nested-stepper.component.html',
  styleUrls: ['./nested-stepper.component.scss']
})
@UntilDestroy()
export class NestedStepperComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('nestedStepper') public stepper: MatStepper;
  @ViewChild('selectStep') selectStep: CdkStep
  @ViewChild('annotateStep') annotateStep: CdkStep
  @ViewChild('statisticalDesignStep') statisticalDesignStep: CdkStep
  @Input() datasetId: number;

  dataset$: Observable<PDataset | undefined>;
  parameters$: Observable<Parameter[]>;
  summaryComplete$: Observable<boolean> = of(false);
  annotationComplete$: Observable<boolean> = of(false);
  statisticalDesignComplete$: Observable<boolean> = of(false);

  //TODO  remove cdr
  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog,
              public scrollService: ScrollService, private store: Store) {
  }

  ngOnInit(): void {
    this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId));
    this.parameters$ = this.store.select(datasetFeature.selectSummaryParameters(this.datasetId));
    this.summaryComplete$ = this.store.select(datasetFeature.selectSummaryComplete(this.datasetId)).pipe(distinctUntilChanged(), share());
    this.summaryComplete$.pipe(delay(0), untilDestroyed(this)).subscribe(() => this.stepper.next());
    this.annotationComplete$ = this.store.select(datasetFeature.selectAnnotationComplete(this.datasetId)).pipe(distinctUntilChanged(), share());
    this.statisticalDesignComplete$ = this.store.select(datasetFeature.selectStatisticalDesignComplete(this.datasetId)).pipe(distinctUntilChanged(), share());
  }


  ngAfterViewInit() {
    // this.loadDatasetService.dataset$.subscribe(dataset => {
    //   this.dataset = dataset;
    //   this.cdr.detectChanges();
    //   this.stepper.selected = this.annotateStep;
    // });
  }


  ngAfterViewChecked(): void {
    // this.cdr.detectChanges();
  }

  deleteDataset($event: MouseEvent) {
    $event.stopPropagation();
    this.store.dispatch(datasetActions.delete({id: this.datasetId}))
  }

  saveData() {
    this.store.dispatch(datasetActions.save({id: this.datasetId}))
  }

  changeParameters() {

    this.store.dispatch(datasetActions.openSummaryParameters({id: this.datasetId}))

  }


  updateScroll() {
    setTimeout(() => this.scrollService.triggerResize(), 300);
  }

  checkAnnotationData(): boolean {
    // return this.loadDatasetService?.computeValidColumns(this.dataset).length > 0;
    return true;
  }

  protected readonly console = console;

  stepChange($event: StepperSelectionEvent) {
    switch ($event.selectedStep) {
      case this.selectStep:
        this.store.dispatch(datasetActions.clear({id: this.datasetId}))
        break;
      case this.annotateStep:
        break;
      case this.statisticalDesignStep:
        break;
    }
  }
}
