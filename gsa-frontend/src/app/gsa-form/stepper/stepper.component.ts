import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {AnalysisService} from "../services/analysis.service";
import {MatStep, MatStepper} from "@angular/material/stepper";


@Component({
  selector: 'gsa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit, OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('selectMethod') selectMethod: MatStep;
  @ViewChild('selectDataset') selectDatasets: MatStep;
  @ViewChild('options') optionsComponent: MatStep;
  @ViewChild('analysis') analysisComponent: MatStep;


  constructor(private cdr: ChangeDetectorRef, public analysisMethodsService: AnalysisMethodsService, public analysisService: AnalysisService) {
  }


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.analysisService.addDataset();
  }

  addDataset() {
    this.analysisService.addDataset();
  }

}
