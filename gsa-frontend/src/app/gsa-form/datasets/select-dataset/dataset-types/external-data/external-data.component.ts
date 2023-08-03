import {Component, Input, OnInit} from '@angular/core';
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {Dataset} from "../../../../model/dataset.model";
import {PDatasetSource} from "../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {parameterFeature} from "../../../../state/parameter/parameter.selector";
import {Observable, tap} from "rxjs";
import {Parameter} from "../../../../state/parameter/parameter.state";
import {datasetSourceActions} from "../../../../state/dataset-source/dataset-source.action";
import {datasetSourceFeature} from "../../../../state/dataset-source/dataset-source.selector";

@Component({
  selector: 'gsa-external-data',
  templateUrl: './external-data.component.html',
  styleUrls: ['./external-data.component.scss']
})
export class ExternalDataComponent implements OnInit {
  @Input() dataset: Dataset;
  @Input() data: PDatasetSource;
  parameters$: Observable<Parameter[]>;
  isSelected$: Observable<boolean>;

  constructor(public fetchDatasetService: FetchDatasetService, public loadDatasetService: LoadDatasetService, private store: Store) {
  }

  ngOnInit(): void {
    this.parameters$ = this.store.select(parameterFeature.selectParameters(this.data.parameterIds as string[])).pipe(
        tap(x => console.log(x))
    );
    this.isSelected$ = this.store.select(datasetSourceFeature.selectIsSelected(this.data));
  }


  select(): void {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.data}));
  }


  loadData(parameters: Parameter[]): void {
    this.loadDatasetService.loadDataset(
      this.data.id,
      parameters.map(param => ({name: param.name, value: param.value})),
      this.dataset);
  }
}


