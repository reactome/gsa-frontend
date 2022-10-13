import { Component, OnInit } from '@angular/core';
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../model/dataset.model";
import {DatasetService} from "../services/dataset.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  steps: 4
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DatasetService) {

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form.get('name')?.valueChanges
      .subscribe(val => {
        this.name = val;
      });
    this.exampleData$ = this.dataService.fetchExampleData()
    this.importData$ = this.dataService.fetchImportData()
    this.localData$ = this.dataService.fetchLocalData()
  }
}

