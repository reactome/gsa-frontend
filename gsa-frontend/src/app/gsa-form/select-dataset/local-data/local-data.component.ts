import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, LocalDataset} from "../../model/dataset.model";

@Component({
  selector: 'gsa-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss']
})
export class LocalDataComponent implements OnInit {
  @Input() data: LocalDataset;


  constructor() {
  }

  ngOnInit(): void {
  }

  doStuff() {
    console.log(this.data)
  }
}
