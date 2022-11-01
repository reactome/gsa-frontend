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

  constructor(public loadData: LoadDatasetService, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, public analysisInformation: AnalysisService) {
    this.frmStepTwo = this.formBuilder.group({
      name: ['', Validators.required]
    });

  }



  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.loadData.stepper = this.stepper
  }


  deleteDataset() {
    console.log(this.analysisInformation.datasets, this.numberDataset)
    this.analysisInformation.datasets.splice(this.numberDataset, 1)
    console.log(this.analysisInformation.datasets)
  }
}
