import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {LetModule} from "@ngrx/component";
import {TableComponent} from "./component/table/table.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {UploadTableComponent} from "./component/upload-table/upload-table.component";
import {DownloadTableComponent} from "./component/download-table/download-table.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    TableComponent,
    UploadTableComponent,
    DownloadTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,
    LetModule,
    MatTooltipModule,
    MatIconModule,
  ],
  exports: [
    TableComponent
  ]
})
export class ReactomeTableModule { }
