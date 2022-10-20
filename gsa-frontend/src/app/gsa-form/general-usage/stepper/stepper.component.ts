import {ViewChild, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";
import {Router} from "@angular/router";
import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";
import {delay} from "rxjs";

@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit{


  @ViewChild(AnalysisMethodsComponent) analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild(SelectDatasetComponent) selectDatasetComponent: SelectDatasetComponent;
  @ViewChild(AnnotateDatasetComponent) annotateDatasetComponent: AnnotateDatasetComponent;



  ngOnInit() {

  }

  get analysisStep() {
    return this.analysisMethodsComponent ? this.analysisMethodsComponent.form : null;
  }

  get datasetStep() {
    return this.selectDatasetComponent ? this.selectDatasetComponent.form : null;
  }

  get annotateStep() {
    return this.annotateDatasetComponent ? this.annotateDatasetComponent.form : null;
  }

}
