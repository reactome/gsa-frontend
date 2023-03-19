import {Component, Input, OnInit} from '@angular/core';
import {Settings} from "../../../model/table.model";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";


type MetadataFile = { rowMap: Map<string, number>, csvData: string[][] };

@Component({
  selector: 'gsa-save-dataset-button',
  templateUrl: './save-dataset-button.component.html',
  styleUrls: ['./save-dataset-button.component.scss']
})
export class SaveDatasetButtonComponent implements OnInit {
  @Input() tableSettings: Settings;
  @Input() icon: boolean;
  @Input() datasetName: string;

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  saveAFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.datasetName + '.csv'; // the file name
    const myFileContent: string = this.tableToCSV();
    dlink.href = 'data:text/plain;charset=utf-16,' + myFileContent;
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }


  tableToCSV(): string {
    let csvData: string = "sample_id,"
    csvData += this.toCsv((this.tableSettings.columns)) + "\n"
    this.tableSettings.rows.forEach((row, index) => {
      csvData += row + ","
      csvData += this.toCsv((this.tableSettings.data[index].map(rowValues => rowValues.value))) + "\n"
    })
    return csvData
  }

  toCsv(input: string[]) {
    return input.join(',')
  }
}
