import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import column from "ag-grid-enterprise/dist/lib/excelExport/files/xml/column";

@Component({
  selector: 'gsa-edit-cells',
  templateUrl: './edit-cells.component.html',
  styleUrls: ['./edit-cells.component.scss']
})
export class EditCellsComponent implements OnInit {
  @Input() userSettings?: Settings;
  settings: Settings
  form2_2_2: FormGroup;
  private defaultSettings: Settings = {
    columns: [],
    rows: [],
    data: [[new CellInfo()]],
    rename_cols: true,
    rename_rows: true,
    change_cells: true,
    addColumnButton: false,
    show_rows: true,
    show_cols: false
  }
  chosenCol: string
  tableSettings: Settings

  constructor(private formBuilder: FormBuilder) {
    this.form2_2_2 = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.settings = {...this.defaultSettings, ...this.userSettings}
    this.chosenCol = this.settings.columns[0]
    this.tableSettings = Object.assign({}, this.settings);
    this.computeTableSettings()
  }

  computeTableSettings(): void {
    let columnVals: CellInfo[][] = []
    let colIndex = this.settings.columns.indexOf(this.chosenCol)
    this.settings.data.forEach(row => {
      columnVals.push([row[colIndex]])
    })

    this.tableSettings.columns = [this.chosenCol]
    this.tableSettings.data = columnVals
  }


  selectColumn($event: string) {
    this.chosenCol = $event
    this.computeTableSettings()
  }
}
