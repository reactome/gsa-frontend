import { Injectable } from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {LoadDatasetService} from "./load-dataset.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResponsiceServiceService {

  screenSize$
  constructor(private responsive: BreakpointObserver) { }

  getScreenSize() {
    this.screenSize$ = this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Medium,
      Breakpoints.Large])
      .subscribe(result => {

        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.XSmall]) {
        }
        else if (breakpoints[Breakpoints.Medium]) {
        }
        else if (breakpoints[Breakpoints.Large]) {
        }

      });
  }
}
