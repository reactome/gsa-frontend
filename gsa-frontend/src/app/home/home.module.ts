import {NgModule} from '@angular/core';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {LetModule} from "@ngrx/component";
import {TourAnchorMatMenuDirective} from "ngx-ui-tour-md-menu";


@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LetModule,
    TourAnchorMatMenuDirective,
  ]
})
export class HomeModule {
}
