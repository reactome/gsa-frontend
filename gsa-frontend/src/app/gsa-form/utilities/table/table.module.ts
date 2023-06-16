import {isDevMode, NgModule} from '@angular/core';
import {TableComponent} from "./table.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {MatButtonModule} from "@angular/material/button";

import {selectors} from "./state/table.selector";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

@NgModule({
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature(selectors),

    MatButtonModule,
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),

  ]
})
export class TableModule {
}


