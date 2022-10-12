import { Component, OnInit } from '@angular/core';
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../model/dataset.model";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {DatasetService} from "../services/dataset.service";
import {Method} from "../model/methods.model";
import {Observable} from "rxjs";

@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss']
})
export class SelectDatasetComponent implements OnInit {
  exampleData$: Observable<ExampleDataset[]>
  importData$: Observable<ImportDataset[]>
  localData$: Observable<LocalDataset[]>

  constructor(private dataService: DatasetService) {
  }

  ngOnInit(): void {
    this.exampleData$ = this.dataService.fetchExampleData()
    this.importData$ = this.dataService.fetchImportData()
    this.localData$ = this.dataService.fetchLocalData()

  }
}

