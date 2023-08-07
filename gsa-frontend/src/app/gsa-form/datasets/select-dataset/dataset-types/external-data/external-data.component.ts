import {Component, Input, OnInit} from '@angular/core';
import {PDatasetSource} from "../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {parameterFeature} from "../../../../state/parameter/parameter.selector";
import {Observable, tap} from "rxjs";
import {Parameter} from "../../../../state/parameter/parameter.state";
import {datasetSourceActions} from "../../../../state/dataset-source/dataset-source.action";
import {datasetSourceFeature} from "../../../../state/dataset-source/dataset-source.selector";
import {datasetActions} from "../../../../state/dataset/dataset.actions";

@Component({
    selector: 'gsa-external-data',
    templateUrl: './external-data.component.html',
    styleUrls: ['./external-data.component.scss']
})
export class ExternalDataComponent implements OnInit {

    @Input() source: PDatasetSource;
    parameters$: Observable<Parameter[]>;
    isSelected$: Observable<boolean>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.parameters$ = this.store.select(parameterFeature.selectParameters(this.source.parameterIds as string[])).pipe(
            tap(x => console.log(x))
        );
        this.isSelected$ = this.store.select(datasetSourceFeature.selectIsSelected(this.source));
    }


    select(): void {
        this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
    }


    loadData(parameters: Parameter[]): void {
        this.store.dispatch(datasetActions.load({resourceId: this.source.id, parameters: parameters.map(param => ({name: param.name, value: param.value}))}))
    }
}


