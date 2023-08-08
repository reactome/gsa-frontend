import {Component, Input} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {TableActions} from "../../../../utilities/table/state/table.action";
import {tableFeature} from "../../../../utilities/table/state/table.selector";

@Component({
  selector: 'gsa-edit-columns',
  templateUrl: './edit-columns.component.html',
  styleUrls: ['./edit-columns.component.scss']
})
export class EditColumnsComponent {

  columnStep: FormGroup;
  @Input() tableSettings: Settings;
  columns$ = this.store.select(tableFeature.selectColNames)
  @Input() datasetName: string;


  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.columnStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  addColumn() {
    this.store.dispatch(TableActions.addRow())
    // this.tableSettings.columns.push("Annotation" + (this.tableSettings.columns.length + 1));
    // this.tableSettings.data.forEach((row) => row.push(new CellInfo()));
  }


  deleteColumn(col: string) {
    this.store.dispatch(TableActions.deleteColumn({name: col}))

    // let colIndex = this.tableSettings.columns.indexOf(col);
    // this.tableSettings.columns.splice(colIndex, 1);
    // this.tableSettings.data.forEach((row) => {
    //   row.splice(colIndex, 1)
    // });

  }


  valueChange($event: any, columnIndex: number) {
    this.store.dispatch(TableActions.select({coords: {x:columnIndex, y: 0}}))
    this.store.dispatch(TableActions.write({value: $event.target.value}))
  }
}
