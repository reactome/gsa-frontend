import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, ImportDataset, LocalDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {Dataset} from "../../model/dataset.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {SearchLibraryDataset} from "../../model/dataset-library";

@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss']
})
export class SelectDatasetComponent implements OnInit {
  @Input() dataset: Dataset;
  exampleData$: Observable<ExampleDataset[]>;
  importData$: Observable<ImportDataset[]>;
  localData$: Observable<LocalDataset[]>;
  selectDatasetStep: FormGroup;
  librarySearchData: SearchLibraryDataset;


  constructor(
    private formBuilder: FormBuilder, public fetchDatasetService: FetchDatasetService, public loadDataService: LoadDatasetService, private responsive: BreakpointObserver) {
    this.selectDatasetStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.exampleData$ = this.fetchDatasetService.fetchExampleData();
    this.importData$ = this.fetchDatasetService.fetchImportData();
    this.localData$ = this.fetchDatasetService.fetchLocalData();
    this.librarySearchData = {
      page: 1,
      pageCount: 10,
      title: ""
    };
  }
}

