import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {AnalysisMethodsService} from '../../services/analysis-methods.service';
import {datasetFeature} from '../../state/dataset/dataset.selector';
import {filter, map, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Parameter} from '../../state/parameter/parameter.state';
import {datasetActions} from "../../state/dataset/dataset.actions";
import {isDefined} from "../../utilities/utils";

@Component({
    selector: 'gsa-change-analysis-params',
    templateUrl: './change-analysis-params.component.html',
    styleUrls: ['./change-analysis-params.component.scss'],
})
export class ChangeAnalysisParamsComponent implements OnInit {

    parameters$: Observable<Parameter[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { datasetId: number }, public store: Store,
        public analysisMethodsService: AnalysisMethodsService,
    ) {
    }

    ngOnInit(): void {
        // this.setToDefault()
        this.parameters$ = this.store.select(datasetFeature.selectSummaryParameters(this.data.datasetId)).pipe(
            filter(isDefined),
            map(params => params.filter(param => param.scope === 'dataset'))
        );
    }

    reset() {
        this.store.dispatch(datasetActions.resetSummaryParameters({id: this.data.datasetId}));
        // this.dataset.dataset.summary!.parameters = this.analysisMethodsService.selectedMethod?.parameters.filter(para =>
        //   para.scope !== "common").map(param => {
        //   return Object.assign({}, param)
        // })

        // this.store.dispatch(datasetActions.resetSummaryParameters())

        // this.store.dispatch(parameterActions.update({
        //   update: {
        //     id: this.dataset$.summary!.parameters![0].id,
        //     changes: {
        //       value
        //     }
        //   }
        // }))

    }

    updateParam(param: Parameter, parameters: Parameter[]) {
        parameters = parameters.map(srcParam => srcParam.name === param.name ? param : srcParam);
        this.store.dispatch(datasetActions.setSummaryParameters({id: this.data.datasetId, parameters}))
    }
}
