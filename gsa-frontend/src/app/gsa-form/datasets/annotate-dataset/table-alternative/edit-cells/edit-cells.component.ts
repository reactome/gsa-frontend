import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
    this.tableSettings = Object.assign({}, this.tableSettings);
    this.tableSettings.addColumnButton = false;
    this.tableSettings.showCols = false;
    this.columnTableSettings = Object.assign({}, this.tableSettings);
    this.chosenCol = this.tableSettings.columns[0];
    this.computeTableSettings();
  }

  computeTableSettings(): void {
    this.columnTableSettings = Object.assign({}, this.columnTableSettings);

    let colIndex = this.tableSettings.columns.indexOf(this.chosenCol);
    let columnValues: CellInfo[][] = this.tableSettings.data.map(row => [row[colIndex]]);
    this.columnTableSettings.columns = [this.chosenCol];
    this.columnTableSettings.data = columnValues;

  }
}
