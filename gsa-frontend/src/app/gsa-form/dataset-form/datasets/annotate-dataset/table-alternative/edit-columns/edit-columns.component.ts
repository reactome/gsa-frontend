import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TableStore} from "../../../../../utilities/table/state/table.store";

@Component({
  selector: 'gsa-edit-columns',
  templateUrl: './edit-columns.component.html',
  styleUrls: ['./edit-columns.component.scss']
})
export class EditColumnsComponent {

  columnStep: FormGroup;
  @Input() store: TableStore
  @Input() datasetName: string;


  constructor(private formBuilder: FormBuilder) {
    this.columnStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  addColumn() {
    this.store.addColumn()
    // this.tableSettings.columns.push("Annotation" + (this.tableSettings.columns.length + 1));
    // this.tableSettings.data.forEach((row) => row.push(new CellInfo()));
  }


  deleteColumn(col: string) {
    this.store.deleteColumn({name: col});

    // let colIndex = this.tableSettings.columns.indexOf(col);
    // this.tableSettings.columns.splice(colIndex, 1);
    // this.tableSettings.data.forEach((row) => {
    //   row.splice(colIndex, 1)
    // });

  }


  valueChange($event: any, columnIndex: number) {
    this.store.selectCell({coords: {x:columnIndex, y: 0}})
    this.store.write({value: $event.target.value})
  }
}
