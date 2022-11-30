import {Component, Input} from '@angular/core';
import {ExampleDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {currentDataset} from "../../../../model/analysisObject.model";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent {
  @Input() currentDataset: currentDataset;
  @Input() data: ExampleDataset;


  constructor(public fetchDatasetService: FetchDatasetService, public loadDataService: LoadDatasetService) {
  }


  select() {
    this.fetchDatasetService.chosenDataset = this.data;
    this.loadData();
  }

  loadData() {
    this.loadDataService.loadDataset('example_datasets', [{
      name: "dataset_id",
      value: this.data.id
    }], this.currentDataset);
  }
}
