import {ViewChild, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../../select-dataset/select-dataset.component";
import {Router} from "@angular/router";

@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {


  @ViewChild(AnalysisMethodsComponent) analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild(SelectDatasetComponent) selectDatasetComponent: SelectDatasetComponent;

  constructor(private _formBuilder: FormBuilder, private route: Router) {}

  ngOnInit() {
  }

  get analysisStep() {
    return this.analysisMethodsComponent ? this.analysisMethodsComponent.form : null;
  }

  get datasetStep() {
    return this.selectDatasetComponent ? this.selectDatasetComponent.form : null;
  }

}
