import {ViewChild, Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";

import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";


@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit{

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  @ViewChild('selectMethod') analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild('selectData') selectDatasetComponent: SelectDatasetComponent;
  @ViewChild('annotateData') annotateDatasetComponent: AnnotateDatasetComponent;

  constructor(private cdr :ChangeDetectorRef){}

  ngAfterViewInit(){
    this.form1 = this.analysisMethodsComponent.frmStepOne;
    this.form2 = this.selectDatasetComponent.frmStepTwo
    this.form3 = this.annotateDatasetComponent.frmStepThree
    this.cdr.detectChanges();
  }


  ngOnInit() {

  }



}
