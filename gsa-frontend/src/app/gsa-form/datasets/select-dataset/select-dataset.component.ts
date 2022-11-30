import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, ImportDataset, LocalDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {map, Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {currentDataset} from "../../model/analysisObject.model";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss']
})
export class SelectDatasetComponent implements OnInit {
  @Input() dataset: currentDataset;
  exampleData$: Observable<ExampleDataset[]>;
  importData$: Observable<ImportDataset[]>;
  localData$: Observable<LocalDataset[]>;
  selectDatasetStep: FormGroup;
  firstDividerVertical$: Observable<boolean>;
  secondDividerVertical$: Observable<boolean>;

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
    this.firstDividerVertical$ = this.responsive.observe('(max-width: 599px)').pipe(map(value => !value.matches));
    this.secondDividerVertical$ = this.responsive.observe('(max-width: 1205px)').pipe(map(value => !value.matches));
  }
}

