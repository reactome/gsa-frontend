import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {datasetFeature} from '../../../state/dataset/dataset.selector';
import {filter, map, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {datasetActions} from "../../../state/dataset/dataset.actions";
import {isDefined} from "../../../utilities/utils";
import {paramTracker} from "../../../utilities/method-parameter/method-parameter.component";
import {Parameter} from "../../../model/parameter.model";

@Component({
    selector: 'gsa-change-analysis-params',
    templateUrl: './change-analysis-params.component.html',
    styleUrls: ['./change-analysis-params.component.scss'],
})
export class ChangeAnalysisParamsComponent implements OnInit {

    parameters$: Observable<Parameter[]>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { datasetId: number }, public store: Store,
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
    }

    updateParam(param: Parameter, parameters: Parameter[]) {
        parameters = parameters.map(srcParam => srcParam.name === param.name ? param : srcParam);
        this.store.dispatch(datasetActions.setSummaryParameters({id: this.data.datasetId, parameters}))
    }

  protected readonly paramTracker = paramTracker;
}
