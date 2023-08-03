import {Component, Input} from '@angular/core';
import {ExampleDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {Dataset} from "../../../../model/dataset.model";
import {PDatasetSource} from "../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {datasetSourceActions} from "../../../../state/dataset-source/dataset-source.action";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent {
  @Input() dataset: Dataset;
  @Input() data: PDatasetSource;


  constructor(public store: Store, public loadDataService: LoadDatasetService) {
  }


  select() {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.data}));
    this.loadData();
  }

  loadData() {
    this.loadDataService.loadDataset('example_datasets', [{
      name: "dataset_id",
      value: this.data.id
    }], this.dataset);
  }
}
