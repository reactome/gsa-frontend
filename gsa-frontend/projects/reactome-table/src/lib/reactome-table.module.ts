import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {LetDirective} from "@ngrx/component";
import {TableComponent} from "./component/table/table.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {UploadTableComponent} from "./component/upload-table/upload-table.component";
import {DownloadTableComponent} from "./component/download-table/download-table.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {FixedSizeVirtualScrollStrategy, ScrollingModule, VIRTUAL_SCROLL_STRATEGY} from '@angular/cdk/scrolling';


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
        LetDirective,
        MatTooltipModule,
        MatIconModule,
        ScrollingModule,
    ],
  exports: [
    TableComponent
  ],
})
export class ReactomeTableModule { }
