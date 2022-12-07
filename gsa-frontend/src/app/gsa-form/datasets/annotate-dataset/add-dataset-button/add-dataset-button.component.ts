import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../model/table.model";
import {map, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {MatSnackBar} from "@angular/material/snack-bar";

type MetadataFile = { rowMap: Map<string, number>, csvData: string[][] };

@Component({
  selector: 'gsa-add-dataset-button',
  templateUrl: './add-dataset-button.component.html',
  styleUrls: ['./add-dataset-button.component.scss']
})
export class AddDatasetButtonComponent implements OnInit {
  @Input() tableSettings: Settings;
  @Input() icon: boolean;


  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  parseMetadataCSV(file: File): Observable<MetadataFile> {
    return fromPromise(file.text())
      .pipe(map(content => {
        const out: MetadataFile = {csvData: [], rowMap: new Map<string, number>()};
        content.split("\n").forEach((line, index) => {
          const row = line.split((file.type == "text/csv") ? "," : "\t");
          out.rowMap.set(row[0], index);
          out.csvData.push(row.slice(1));
        })
        return out
      }));
  }

  uploadFile(event: any) {
    const sub = this.parseMetadataCSV(event.target.files[0])
      .subscribe(data => {
        let unfoundRows: string[] = [];
        this.tableSettings.rows.forEach((row, rowIndex) => {
          let rowIndexCSV = data.rowMap.get(row);
          if (!rowIndexCSV) {
            data.csvData[0].forEach(col => {
              this.tableSettings.data[rowIndex].push(new CellInfo(""));
            })
            unfoundRows.push(row)
            return;
          }
          data.csvData[rowIndexCSV].forEach(col => {
            this.tableSettings.data[rowIndex].push(new CellInfo(col));
          })
        })
        if (unfoundRows.length === this.tableSettings.rows.length) {
          this.snackBar.open(
            'No rows matched (The rows of the table should appear in the first column of your uploaded file.)', "Close", {
              panelClass: ['warning-snackbar'],
              duration: 10000
            });
        } else if (unfoundRows.length > 0) {
          this.snackBar.open("Warning: " + unfoundRows.length + " rows could not be found in the submitted file. " +
            "The following rows could not be found: " + unfoundRows + ".", "Close", {
            panelClass: ['warning-snackbar'],
            duration: 10000
          });
        }
        data.csvData[0].forEach((col) => this.tableSettings.columns.push(col));
        this.deleteDoubledCols()
        sub.unsubscribe();
      });

  }

  deleteDoubledCols(): void {
    this.tableSettings.columns.forEach((col, index) => {
      if (this.tableSettings.columns.indexOf(col) != index) {
        this.tableSettings.columns[index] = col + "_2";
      }
      return col
    })
  }


}
