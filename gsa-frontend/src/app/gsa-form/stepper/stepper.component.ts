import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {Store} from "@ngrx/store";
import {methodFeature} from "../state/method/method.selector";
import {map, Observable} from "rxjs";
import {datasetFeature} from "../state/dataset/dataset.selector";
import {datasetActions} from "../state/dataset/dataset.actions";
import {analysisActions} from "../state/analysis/analysis.actions";
import {Dataset} from "../state/dataset/dataset.state";
import {Method} from "../state/method/method.state";
import {Parameter} from "../state/parameter/parameter.state";


@Component({
    selector: 'gsa-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements AfterViewInit, OnInit {
    @ViewChild('stepper') stepper: MatStepper;

    selectedMethod$ = this.store.select(methodFeature.selectSelectedMethod);
    methodSelected$ = this.selectedMethod$.pipe(map(method => method !== null))

    methodParameters$ = this.selectedMethod$.pipe(map(method => method?.parameters))
    reportRequired$ = this.methodParameters$.pipe(map(parameters => (parameters?.find(parameter => parameter.name === 'create_reports')?.value || false) as boolean))
    datasetIds$ = this.store.select(datasetFeature.selectIds) as Observable<number[]>;
    datasets$ = this.store.select(datasetFeature.selectAll) as Observable<Dataset[]>;
    allSaved$: Observable<boolean> = this.store.select(datasetFeature.selectAllSaved);

    constructor(private cdr: ChangeDetectorRef, private store: Store) {
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.addDataset();
    }

    addDataset() {
        this.store.dispatch(datasetActions.add());
    }

    loadAnalysis(method: Method, datasets: Dataset[], parameters: Parameter[], reportsRequired: boolean) {
        this.store.dispatch(analysisActions.load({method, datasets, parameters, reportsRequired}))
    }

    initAnnotations() {
        this.store.dispatch(datasetActions.initAnnotationColumns())
    }

}
