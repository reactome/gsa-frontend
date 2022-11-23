import {AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";
import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";
import {StatisticalDesignComponent} from "../../datasets/statistical-design/statistical-design.component";
import {AnalysisService} from "../../services/analysis.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {MatStepper} from "@angular/material/stepper";
import {StatisticalDesignService} from "../../services/statistical-design.service";
import {AnalysisObject} from "../../model/analysisObject.model";

@Component({
  selector: 'gsa-nested-stepper',
  templateUrl: './nested-stepper.component.html',
  styleUrls: ['./nested-stepper.component.scss']
})
export class NestedStepperComponent implements AfterViewInit {
  frmStepTwo: FormGroup;
  form2_1: FormGroup;
  form2_2: FormGroup;
  form2_3: FormGroup;
  @ViewChild('nestedStepper') public stepper: MatStepper;
  @ViewChild('selectData') selectDatasetComponent: SelectDatasetComponent;
  @ViewChild('annotateData') annotateDatasetComponent: AnnotateDatasetComponent;
  @ViewChild("statisticalDesign") statisticalDesignComponent: StatisticalDesignComponent

  @Input() analysisObject: AnalysisObject;

  constructor(public loadData: LoadDatasetService, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, public analysisInformation: AnalysisService, public loadDataService: LoadDatasetService, public statisticalDesignService: StatisticalDesignService) {
    this.frmStepTwo = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.loadData.stepper = this.stepper
  }


  deleteDataset() {
    let indexAnalysisObject = this.analysisInformation.datasetObjects.indexOf(this.analysisObject)
    this.analysisInformation.datasetObjects.splice(indexAnalysisObject, 1)
    this.analysisInformation.savedDatasets -= 1
    this.loadDataService.addedDatasets -= 1
  }


  nextStep() {
    // @ts-ignore
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  statisticalDesignValid() {
    if (this.analysisObject.statisticalDesign?.analysisGroup !== undefined) {
      if (this.analysisObject.datasetTable?.columns.indexOf(this.analysisObject.statisticalDesign!.analysisGroup) === -1) {
        this.analysisObject.statisticalDesign!.analysisGroup = undefined
      }
    }
  }

  saveData() {
    this.analysisObject.saved = true
    this.analysisInformation.savedDatasets += 1
    this.loadDataService.loadingProgress = 'not started';
  }


}
