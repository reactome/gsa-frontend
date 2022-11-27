import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {Clipboard} from "@angular/cdk/clipboard";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisObject} from "../../../../model/analysisObject.model";
import {AnalysisMethodsService} from "../../../../services/analysis-methods.service";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'gsa-edit-columns',
  templateUrl: './edit-columns.component.html',
  styleUrls: ['./edit-columns.component.scss']
})
export class EditColumnsComponent implements OnInit {

  settings: Settings
  form2_2_1: FormGroup;
  @Input() userSettings?: Settings;
  private defaultSettings: Settings = {
    columns: [],
    rows: [],
    data: [[new CellInfo()]],
    rename_cols: true,
    rename_rows: true,
    change_cells: true
  }

  constructor(private formBuilder: FormBuilder) {
    this.form2_2_1 = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.settings = {...this.defaultSettings, ...this.userSettings}
  }

  addColumn() {
    this.settings.columns.push("Annotation" + (this.settings.columns.length + 1))
    this.settings.data.forEach((row) => row.push(new CellInfo()))
  }

  deleteColumn(col: string) {
    let colIndex = this.settings.columns.indexOf(col)
    this.settings.columns.splice(colIndex, 1)
    this.settings.data.forEach((row) => {
      row.splice(colIndex, 1)
    })

  }
}
