import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {AnalysisService} from "../../services/analysis.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {MatStepper} from "@angular/material/stepper";
import {Dataset} from "../../model/dataset.model";
import {MatDialog} from "@angular/material/dialog";
import {ChangeAnalysisParamsComponent} from "../../datasets/change-analysis-params/change-analysis-params.component";
import {ScrollService} from "../../services/scroll.service";
import {CdkStep} from "@angular/cdk/stepper";

@Component({
    selector: 'gsa-nested-stepper',
    templateUrl: './nested-stepper.component.html',
    styleUrls: ['./nested-stepper.component.scss']
})
export class NestedStepperComponent implements AfterViewInit, AfterViewChecked {

    @ViewChild('nestedStepper') public stepper: MatStepper;
    @ViewChild('annotate') annotateStep: CdkStep
    @Input() dataset: Dataset;

    constructor(private cdr: ChangeDetectorRef, public analysisService: AnalysisService, public dialog: MatDialog,
                public scrollService: ScrollService) {
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
        $event.stopPropagation()
        let indexDataset = this.analysisService.datasets.indexOf(this.dataset);
        this.analysisService.datasets.splice(indexDataset, 1);
    }

    setValidStatisticalDesign() {
        if (this.dataset.statisticalDesign?.analysisGroup !== undefined) {
            if (!this.dataset.table?.columns.includes(this.dataset.statisticalDesign!.analysisGroup)) {
                this.dataset.statisticalDesign!.analysisGroup = undefined;
            }
        }
    }


    saveData() {
        this.dataset.saved = true;
    }

    checkStatisticalDesign(): boolean {
        return this.dataset.statisticalDesign?.analysisGroup !== undefined &&
            this.dataset.statisticalDesign?.comparisonGroup1 !== undefined &&
            this.dataset.statisticalDesign?.comparisonGroup2 !== undefined;
    }


    changeParameters($event: MouseEvent) {
        $event.stopImmediatePropagation()
        this.dialog.open(ChangeAnalysisParamsComponent, {
            data: {dataset: this.dataset},
        });
    }

    setStep() {
        this.updateScroll();
        if (this.dataset.saved) {
            setTimeout(() => this.stepper.selectedIndex = 1);
        }
    }

    updateScroll() {
        setTimeout(() => this.scrollService.triggerResize(), 300);
    }

    checkAnnotationData(): boolean {
        // return this.loadDatasetService?.computeValidColumns(this.dataset).length > 0;
        return true;
    }
}
