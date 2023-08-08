import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {tableFeature} from "../../../utilities/table/state/table.selector";
import {take} from "rxjs";

@Component({
  selector: 'gsa-save-dataset-button',
  templateUrl: './save-dataset-button.component.html',
  styleUrls: ['./save-dataset-button.component.scss']
})
export class SaveDatasetButtonComponent implements OnInit {
  @Input() icon: boolean;
  @Input() datasetName: string;

  constructor(private snackBar: MatSnackBar, private store: Store) {
  }

  ngOnInit(): void {
  }

  saveAFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.datasetName + '.csv'; // the file name
    this.store.select(tableFeature.selectRawData).pipe(take(1)).subscribe(
      table => {
        dlink.href = 'data:text/plain;charset=utf-16,' + table.map(row => row.join(", ")).join("\n");
        dlink.click(); // this will trigger the dialog window
        dlink.remove();
      }
    )

  }

}
