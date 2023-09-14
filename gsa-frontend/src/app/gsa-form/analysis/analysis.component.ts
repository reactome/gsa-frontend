import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisService} from "../services/analysis.service";
import {Store} from "@ngrx/store";
import {analysisFeature} from "../state/analysis/analysis.selector";


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

    constructor(private formBuilder: FormBuilder, public analysisService: AnalysisService, public store: Store) {
        this.analysisStep = this.formBuilder.group({
            name: ['', Validators.required]
        });

    }

    ngOnInit(): void {

    }
}
