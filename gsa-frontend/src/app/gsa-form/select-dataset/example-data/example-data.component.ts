import {Component, Input, OnInit} from '@angular/core';
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../../model/dataset.model";
import {Router} from "@angular/router";
import {FetchDatasetService} from "../../services/fetchDataset.service";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent implements OnInit {
  @Input() data: ExampleDataset;


  constructor(public dataService: FetchDatasetService) {
  }

  ngOnInit(): void {
  }

  doStuff() {
    this.dataService.chooseDataset = this.data;
  }
}
