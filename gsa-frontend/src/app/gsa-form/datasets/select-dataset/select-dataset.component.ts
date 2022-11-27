import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, ImportDataset, LocalDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {AnalysisMethodsService} from "../../services/analysis-methods.service";
import {AnalysisObject} from "../../model/analysisObject.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

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
  frmStepTwoOne: FormGroup;
  @Input() analysisObject : AnalysisObject
  isXSmall: boolean = false

  constructor(
    private anal: AnalysisMethodsService, private formBuilder: FormBuilder, public dataService: FetchDatasetService, public loadDataService: LoadDatasetService, private responsive: BreakpointObserver) {
    this.frmStepTwoOne = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.exampleData$ = this.dataService.fetchExampleData()
    this.importData$ = this.dataService.fetchImportData()
    this.localData$ = this.dataService.fetchLocalData()



  }


}

