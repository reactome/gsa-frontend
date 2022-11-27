import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {AnalysisObject} from "../../../../model/analysisObject.model";
import {LoadingProgressComponent} from "../../loading-progress/loading-progress.component";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent implements OnInit {
  @Input() analysisObject : AnalysisObject
  @Input() data: ExampleDataset;


  constructor(public dataService: FetchDatasetService, public loadDataService : LoadDatasetService) {
  }

  ngOnInit(): void {
  }

  select() {
    this.dataService.chooseDataset = this.data;
    this.loadData()
    // const dialogRef = this.dialog.open(LoadingProgressComponent, {
    //   width: '250px'
    //   // data: {name: this.name, animal: this.animal},
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   // this.animal = result;
    // });
  }

  loadData() {
    this.loadDataService.loadDataset('example_datasets', [{
      name: "dataset_id",
      value: this.data.id
    }], this.analysisObject)
  }
}
