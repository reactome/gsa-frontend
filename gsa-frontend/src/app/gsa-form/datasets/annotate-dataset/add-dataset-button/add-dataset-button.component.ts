import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../model/table.model";
import {map, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {WarningSnackbarComponent} from "./warning-snackbar/warning-snackbar.component";

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
          this.snackBar.openFromComponent(WarningSnackbarComponent, {
            data: {
              message: 'No rows matched \n (The rows of the table should appear in the first column of your uploaded file.)',
              warning: false
            }
          });
        } else if (unfoundRows.length > 0) {
          this.snackBar.openFromComponent(WarningSnackbarComponent, {
            data: {
              message: unfoundRows.length + " rows could not be found in the submitted file. \n The following rows could not be found: " + unfoundRows + ".",
              warning: true
            }
          });
        }
        data.csvData[0].forEach((col) => this.tableSettings.columns.push(col));
        this.renameDoubledCols()
        // this.deleteEmptyCols()
        sub.unsubscribe();
      });

  }

  renameDoubledCols(): void {
    this.tableSettings.columns.forEach((col, index) => {
      if (this.tableSettings.columns.indexOf(col) != index) {
        this.tableSettings.columns[index] = col + "_2";
      }
      return col
    })
  }

  //
  // private deleteEmptyCols(): void {
  //   let deleteCols: number[] = []
  //   let emptyCol: boolean
  //   this.tableSettings.columns.forEach((col, index) => {
  //     emptyCol = true
  //     this.tableSettings.data.forEach(row => {
  //       if (row[index].value !== "") {
  //         emptyCol = false
  //       }
  //     })
  //     if (emptyCol) {
  //       deleteCols.push(index)
  //     }
  //   })
  //
  //   deleteCols.forEach(col => {
  //     this.tableSettings.columns = this.tableSettings.columns.slice(col, 1)
  //     this.tableSettings.data = this.tableSettings.data.map(row => row.slice(col, 1))
  //   })
  // }
}
