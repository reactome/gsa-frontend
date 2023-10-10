import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Observable, tap} from "rxjs";
import {TourService} from "ngx-ui-tour-md-menu";
import {TourUtilsService} from "../services/tour-utils.service";
import {HeightService} from "../services/height.service";

@Component({
  selector: 'gsa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  screenSize$: Observable<BreakpointState>;
  sizes = {
    Small: '(min-width: 600px)',
    Medium: '(min-width: 960px)'
  };

  constructor(breakpointObserver: BreakpointObserver, private tour: TourUtilsService, public height: HeightService) {
    this.screenSize$ = breakpointObserver.observe([
      this.sizes.Small,
      this.sizes.Medium
    ]);
  }

  startTour() {
    this.tour.start();
  }
}
