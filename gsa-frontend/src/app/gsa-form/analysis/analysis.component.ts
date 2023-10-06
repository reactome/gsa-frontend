import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {analysisFeature} from "../state/analysis/analysis.selector";
import {CdkStep} from "@angular/cdk/stepper";


@Component({
    selector: 'gsa-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
    analysisStep: FormGroup;
    reportsRequired$ = this.store.select(analysisFeature.selectReportsRequired)
    analysisLoadingStatus$ = this.store.select(analysisFeature.selectAnalysisLoadingStatus)
    reportLoadingStatus$ = this.store.select(analysisFeature.selectReportLoadingStatus)
    result$ = this.store.select(analysisFeature.selectAnalysisResult)

    @Input() setMethodStep: CdkStep;
    @Input() datasetId: number;

    constructor(private formBuilder: FormBuilder, public store: Store) {
        this.analysisStep = this.formBuilder.group({
            name: ['', Validators.required]
        });

    }

    ngOnInit(): void {

    }

  goToSelectMethod() {
    this.setMethodStep.select();
  }
}
