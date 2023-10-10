// https://docs.google.com/document/d/1jpvK1vNV8lqzhvKcVEemoeUEiF26n3IFOfLrhF02bqg/edit
import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from '@ngrx/effects';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import { BackgroundComponent } from './background/background.component';
import { TourComponent } from './tour/tour.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {LetModule} from "@ngrx/component";


@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    TourComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      router: routerReducer
    }, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: true, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    TourMatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    LetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
