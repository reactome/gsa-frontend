import {Component} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {Observable} from "rxjs";
import {TourUtilsService} from "../services/tour-utils.service";
import {HeightService} from "../services/height.service";
import {Settings, numberToLetter} from "reactome-table";

@Component({
  selector: 'gsa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent {

  screenSize$: Observable<BreakpointState>;
  sizes = {
    Small: '(min-width: 600px)',
    Medium: '(min-width: 960px)'
  };
  settings: Partial<Settings> = {
    deleteCol: false,
    deleteRow: false,
    renameRows: false,
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

function range(from: number, to: number) {
  return new Array(to - from).fill(0).map((_, i) => from + i);
}
