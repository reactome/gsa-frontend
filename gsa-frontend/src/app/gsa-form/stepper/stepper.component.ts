import {ViewChild, Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AnalysisMethodsComponent} from "../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../datasets/select-dataset/select-dataset.component";

import {AnnotateDatasetComponent} from "../datasets/annotate-dataset/annotate-dataset.component";
import {StatisticalDesignComponent} from "../datasets/statistical-design/statistical-design.component";
import {NestedStepperComponent} from "./nested-stepper/nested-stepper.component";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {AnalysisService} from "../services/analysis.service";
import {LoadDatasetService} from "../services/load-dataset.service";
import {OptionsComponent} from "../options/options.component";
import {AnalysisComponent} from "../analysis/analysis.component";


@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit {

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;

  @ViewChild('selectMethod') analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild('selectDataset') selectDatasetComponent: NestedStepperComponent;
  @ViewChild('options') optionsComponent: OptionsComponent
  @ViewChild('analysis') analysisComponent: AnalysisComponent


  constructor(private cdr: ChangeDetectorRef, public methods: AnalysisMethodsService, public loadService: LoadDatasetService, public analysisInformation : AnalysisService) {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
