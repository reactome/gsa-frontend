import {AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";
import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";
import {StatisticalDesignComponent} from "../../datasets/statistical-design/statistical-design.component";
import {AnalysisService} from "../../services/analysis.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {MatStepper} from "@angular/material/stepper";
import {currentDataset} from "../../model/analysisObject.model";

@Component({
  selector: 'gsa-nested-stepper',
  templateUrl: './nested-stepper.component.html',
  styleUrls: ['./nested-stepper.component.scss']
})
export class NestedStepperComponent implements AfterViewInit {

  @ViewChild('nestedStepper') public stepper: MatStepper;
  @ViewChild('selectData') selectDatasetComponent: SelectDatasetComponent;
  @ViewChild('annotateData') annotateDatasetComponent: AnnotateDatasetComponent;
  @ViewChild("statisticalDesign") statisticalDesignComponent: StatisticalDesignComponent
  @Input() currentDataset: currentDataset;

  constructor(public loadDatasetService: LoadDatasetService, private cdr: ChangeDetectorRef, public analysisService: AnalysisService) {
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.loadDatasetService.stepper = this.stepper;
  }


  deleteDataset() {
    let indexCurrentDataset = this.analysisService.analysisDatum.indexOf(this.currentDataset);
    this.analysisService.analysisDatum.splice(indexCurrentDataset, 1);
  }


  setValidStatisticalDesign() {
    if (this.currentDataset.statisticalDesign?.analysisGroup !== undefined) {
      if (this.currentDataset.table?.columns.indexOf(this.currentDataset.statisticalDesign!.analysisGroup) === -1) {
        this.currentDataset.statisticalDesign!.analysisGroup = undefined;
      }
    }
  }

  saveData() {
    this.currentDataset.saved = true;
  }


}
