import {Component, Input, OnInit} from '@angular/core';
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../../model/dataset.model";
import {Router} from "@angular/router";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  @Input() data: Dataset;
  localDataset?: LocalDataset;
  exampleDataset?: ExampleDataset;
  importDataset?: ImportDataset;


  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (this.data instanceof  LocalDataset) {
      this.localDataset = this.data;
    }
  }

  doStuff() {
    console.log(this.data)
    // if (this.example-data.parameters == null){
    //   this.router.navigate(['/annotateDataset']);
    // }
  }

  isImportDataset(data: Dataset) : ImportDataset | undefined {
    return (data as ImportDataset).parameters ? (data as ImportDataset) : undefined;
  }
}
