import {Component, Input, OnInit} from '@angular/core';
import {first} from "rxjs";
import {TableStore} from "../../../utilities/table/state/table.store";

@Component({
  selector: 'gsa-save-dataset-button',
  templateUrl: './save-dataset-button.component.html',
  styleUrls: ['./save-dataset-button.component.scss']
})
export class SaveDatasetButtonComponent implements OnInit {
  @Input() icon: boolean;
  @Input() datasetName: string;
  @Input() tableStore: TableStore;

  constructor() {
  }

  ngOnInit(): void {
  }

  saveAFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.datasetName + '.csv'; // the file name
    this.tableStore.rawData$.pipe(first()).subscribe(
      table => {
        dlink.href = 'data:text/plain;charset=utf-16,' + table.map(row => row.join(", ")).join("\n");
        dlink.click(); // this will trigger the dialog window
        dlink.remove();
      }
    )
  }

}
