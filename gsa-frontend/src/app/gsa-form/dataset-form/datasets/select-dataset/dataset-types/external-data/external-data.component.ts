import {Component, Input, OnInit} from '@angular/core';
import {PDatasetSource} from "../../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {datasetSourceActions} from "../../../../../state/dataset-source/dataset-source.action";
import {datasetSourceFeature} from "../../../../../state/dataset-source/dataset-source.selector";
import {datasetActions} from "../../../../../state/dataset/dataset.actions";
import {Parameter} from "../../../../../model/parameter.model";
import {paramTracker} from "../../../../../utilities/method-parameter/method-parameter.component";


@Component({
  selector: 'gsa-external-data',
  templateUrl: './external-data.component.html',
  styleUrls: ['./external-data.component.scss']
})
export class ExternalDataComponent implements OnInit {

  @Input() source: PDatasetSource;
  @Input() datasetId: number;
  isSelected$: Observable<boolean>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.isSelected$ = this.store.select(datasetSourceFeature.selectIsSelected(this.source));
  }

  select(): void {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
  }


  loadData(parameters: Parameter[]): void {
    console.log('load data')
    this.store.dispatch(datasetActions.load({
      id: this.datasetId,
      resourceId: this.source.id,
      parameters: parameters.map(param => ({name: param.name, value: param.value}))
    }))
  }

  updateParam(param: Parameter, parameters: Parameter[]) {
    parameters = parameters.map(srcParam => srcParam.name === param.name ? param : srcParam);
    this.store.dispatch(datasetSourceActions.setParameters({id: this.source.id, parameters}))
  }

  protected readonly paramTracker = paramTracker;
}


