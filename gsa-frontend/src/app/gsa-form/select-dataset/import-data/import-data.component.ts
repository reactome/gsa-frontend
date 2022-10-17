import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, ImportDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";

@Component({
  selector: 'gsa-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  @Input() data: ImportDataset;

  constructor(public dataService: FetchDatasetService) {
  }

  ngOnInit(): void {
  }

  select():void {
    this.dataService.chooseDataset = this.data;
  }

  doNothing():void {

  }
}


