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
  @Input() tableSettings: Settings;
  cellStep: FormGroup;
  chosenCol: string;
  columnTableSettings: Settings;

  constructor(private formBuilder: FormBuilder) {
    this.cellStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tableSettings.addColumnButton = false;
    this.tableSettings.showCols = false;
    this.columnTableSettings = Object.assign({}, this.tableSettings);
    this.chosenCol = this.tableSettings.columns[0];
    this.computeTableSettings();
  }

  computeTableSettings(): void {
    let colIndex = this.tableSettings.columns.indexOf(this.chosenCol);
    let columnValues: CellInfo[][] = this.tableSettings.data.map(row => [row[colIndex]]);
    this.columnTableSettings.columns = [this.chosenCol];
    this.columnTableSettings.data = columnValues;
  }
}
