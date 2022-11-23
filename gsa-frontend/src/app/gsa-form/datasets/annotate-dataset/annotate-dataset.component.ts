import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {Settings} from "../../model/table.model";
import {AnalysisObject} from "../../model/analysisObject.model";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent {
  public test: string = "test"
  frmStepTwoTwo: FormGroup;
  @Input() analysisObject: AnalysisObject
  settings: Settings
  // settings: Settings = {
  //
  //   columns: this.analysisObject.datasetTable.columns,
  //   rows: this.analysisObject.datasetTable.rows,
  //   data: this.analysisObject.datasetTable.dataset,
  //   rename_rows: false
  // }


  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService) {
    this.frmStepTwoTwo = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.settings = {
      columns: this.analysisObject.datasetTable!.columns,
      rows: this.analysisObject.datasetTable!.rows,
      data: this.analysisObject.datasetTable!.dataset,
      rename_rows: false
    }
  }
}


