import {Component, OnInit} from '@angular/core';
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {BehaviorSubject, delay, Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import Handsontable from "handsontable";

@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss']
})
export class SelectDatasetComponent implements OnInit {
  exampleData$: Observable<ExampleDataset[]>
  importData$: Observable<ImportDataset[]>
  localData$: Observable<LocalDataset[]>
  name: string;
  frmStepTwo: FormGroup;

  constructor(private formBuilder: FormBuilder, public dataService: FetchDatasetService, public loadDataService: LoadDatasetService) {
    this.frmStepTwo = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.exampleData$ = this.dataService.fetchExampleData()
    this.importData$ = this.dataService.fetchImportData()
    this.localData$ = this.dataService.fetchLocalData()
  }

  reloadData() {
    this.loadDataService.computeTableValues()
  }
}

