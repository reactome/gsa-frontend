import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AnalysisMethodsComponent} from "../analysis-methods/analysis-methods.component";
import {NestedStepperComponent} from "./nested-stepper/nested-stepper.component";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {AnalysisService} from "../services/analysis.service";
import {LoadDatasetService} from "../services/load-dataset.service";
import {OptionsComponent} from "../options/options.component";
import {AnalysisComponent} from "../analysis/analysis.component";
import {MatStepper} from "@angular/material/stepper";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";


@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit, OnInit {

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;


  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('selectMethod') analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild('selectDataset') selectDatasetComponent: NestedStepperComponent;
  @ViewChild('options') optionsComponent: OptionsComponent
  @ViewChild('analysis') analysisComponent: AnalysisComponent


  constructor(private responsive: BreakpointObserver, private cdr: ChangeDetectorRef, public methods: AnalysisMethodsService, public loadService: LoadDatasetService, public analysisInformation: AnalysisService) {
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.analysisInformation.addDataset();
  }

  addDataset() {
    this.analysisInformation.addDataset();
    this.loadService.addedDatasets += 1
  }

  nextStep() {
    // @ts-ignore
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

}
