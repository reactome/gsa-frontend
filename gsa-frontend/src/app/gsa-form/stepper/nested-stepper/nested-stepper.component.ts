import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";
import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";
import {StatisticalDesignComponent} from "../../datasets/statistical-design/statistical-design.component";
import {AnalysisService} from "../../services/analysis.service";
import {AnalysisMethodsService} from "../../services/analysis-methods.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {MatStepper} from "@angular/material/stepper";
import {StatisticalDesignService} from "../../services/statistical-design.service";

@Component({
  selector: 'gsa-nested-stepper',
  templateUrl: './nested-stepper.component.html',
  styleUrls: ['./nested-stepper.component.scss']
})
export class NestedStepperComponent implements AfterViewInit {
  @Input() numberDataset : number
  frmStepTwo: FormGroup;

  form2_1: FormGroup;
  form2_2: FormGroup;
  form2_3: FormGroup;
  @ViewChild('nestedStepper') public stepper: MatStepper;
  @ViewChild('selectData') selectDatasetComponent: SelectDatasetComponent;
  @ViewChild('annotateData') annotateDatasetComponent: AnnotateDatasetComponent;
  @ViewChild("statisticalDesign") statisticalDesignComponent: StatisticalDesignComponent
  toBeAdded: boolean = true;
  deletedDatasets: number = 0

  constructor(public loadData: LoadDatasetService, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, public analysisInformation: AnalysisService, public loadDataService : LoadDatasetService, public statisticalDesignService: StatisticalDesignService) {
    this.frmStepTwo = this.formBuilder.group({
      name: ['', Validators.required]
    });

  }



  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.loadData.stepper = this.stepper
  }


  deleteDataset() {
    // delete this.analysisInformation.datasets[this.numberDataset]
    this.analysisInformation.datasets.splice(this.numberDataset, 1)
    this.loadDataService.datasets.splice(this.numberDataset, 1)
    this.loadDataService.columns.splice(this.numberDataset, 1)
    this.loadDataService.rows.splice(this.numberDataset, 1)
    this.loadDataService.dataSummary.splice(this.numberDataset, 1)
    this.statisticalDesignService.analysisGroup.splice(this.numberDataset, 1)
    this.statisticalDesignService.comparisonGroup1.splice(this.numberDataset, 1)
    this.statisticalDesignService.comparisonGroup2.splice(this.numberDataset, 1)
    console.log(this.loadDataService.currentDataset)
    this.loadDataService.currentDataset -= 1
    this.toBeAdded = true
    this.deletedDatasets += 1
  }

  setCurrentDataset() {
    this.loadDataService.currentDataset = this.numberDataset
  }

  addData() {
    this.analysisInformation.saveDataset();
    this.toBeAdded = false
  }

  changeData() {
    this.analysisInformation.changeDataset(this.numberDataset);
  }
}
