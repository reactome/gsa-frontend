import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {MatDialog} from "@angular/material/dialog";
import {ChangeAnalysisParamsComponent} from "../../datasets/change-analysis-params/change-analysis-params.component";
import {ScrollService} from "../../services/scroll.service";
import {CdkStep} from "@angular/cdk/stepper";
import {Store} from "@ngrx/store";
import {datasetFeature} from "../../state/dataset/dataset.selector";
import {delay, distinctUntilChanged, Observable, of, share, tap} from "rxjs";
import {PDataset} from "../../state/dataset/dataset.state";
import {datasetActions} from "../../state/dataset/dataset.actions";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Component({
    selector: 'gsa-nested-stepper',
    templateUrl: './nested-stepper.component.html',
    styleUrls: ['./nested-stepper.component.scss']
})
@UntilDestroy()
export class NestedStepperComponent implements OnInit, AfterViewInit, AfterViewChecked {

    @ViewChild('nestedStepper') public stepper: MatStepper;
    @ViewChild('annotateStep') annotateStep: CdkStep
    @Input() datasetId: number;
    dataset$: Observable<PDataset | undefined>;
    summaryComplete$: Observable<boolean> = of(false);
    annotationComplete$: Observable<boolean> = of(false);
    statisticalDesignComplete$: Observable<boolean> = of(false);

    //TODO  remove cdr
    constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog,
                public scrollService: ScrollService, private store: Store) {
    }


    ngOnInit(): void {
        this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId));
        this.summaryComplete$ = this.store.select(datasetFeature.selectSummaryComplete(this.datasetId)).pipe(distinctUntilChanged(), share(), tap((complete) => console.log(complete)));
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

    changeParameters($event: MouseEvent) {
        $event.stopImmediatePropagation()
        this.dialog.open(ChangeAnalysisParamsComponent, {
            // data: {dataset: this.dataset}, // TODO
        });
    }

    setStep() {
        // this.updateScroll();
        // if (this.dataset.saved) {
        //   setTimeout(() => this.stepper.selectedIndex = 1);
        // }
    }

    updateScroll() {
        setTimeout(() => this.scrollService.triggerResize(), 300);
    }

    checkAnnotationData(): boolean {
        // return this.loadDatasetService?.computeValidColumns(this.dataset).length > 0;
        return true;
    }

    saveAnnotations() {
        // this.store.dispatch(datasetActions.setAnnotations({annotations, id: this.datasetId}))
    }

    clearSummary() {
        this.store.dispatch(datasetActions.clearSummary({id: this.datasetId}));
    }

    protected readonly console = console;
}
