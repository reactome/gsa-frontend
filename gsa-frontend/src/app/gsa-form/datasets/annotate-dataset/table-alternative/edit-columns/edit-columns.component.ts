import {Component, Input} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'gsa-edit-columns',
  templateUrl: './edit-columns.component.html',
  styleUrls: ['./edit-columns.component.scss']
})
export class EditColumnsComponent {

  columnStep: FormGroup;
  @Input() tableSettings: Settings;
  @Input() datasetName: string;


  constructor(private formBuilder: FormBuilder) {
    this.columnStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  addColumn() {
    this.tableSettings.columns.push("Annotation" + (this.tableSettings.columns.length + 1));
    this.tableSettings.data.forEach((row) => row.push(new CellInfo()));
  }


  deleteColumn(col: string) {
    let colIndex = this.tableSettings.columns.indexOf(col);
    this.tableSettings.columns.splice(colIndex, 1);
    this.tableSettings.data.forEach((row) => {
      row.splice(colIndex, 1)
    });

  }


  valueChange($event: any, columnIndex: number) {
    this.tableSettings.columns[columnIndex] = $event.target.value;

  }
}
