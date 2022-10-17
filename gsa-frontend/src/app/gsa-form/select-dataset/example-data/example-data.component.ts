import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../services/load-dataset.service";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent implements OnInit {
  @Input() data: ExampleDataset;


  constructor(public dataService: FetchDatasetService, public loadDatasetService : LoadDatasetService) {
  }

  ngOnInit(): void {
  }

  select() {
    this.dataService.chooseDataset = this.data;
    this.loadData()
  }

  loadData() {
    console.log(this.data)
    this.loadDatasetService.loadDataset([{
      name: "dataset_id",
      value: this.data.id
    }])
  }
}
