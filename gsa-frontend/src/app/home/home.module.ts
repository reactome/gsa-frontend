import {NgModule} from '@angular/core';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {LetDirective} from "@ngrx/component";
import {TourAnchorMatMenuDirective} from "ngx-ui-tour-md-menu";
import {MatIconModule} from "@angular/material/icon";
import {ReactomeTableModule} from "reactome-table";


@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LetDirective,
    TourAnchorMatMenuDirective,
    MatIconModule,
    ReactomeTableModule
  ]
})
export class HomeModule {
}
