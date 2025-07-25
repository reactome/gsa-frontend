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
  table: string[][] = range(0, 20_000).map(((row, i) =>
    range(0, 27).map(((col, j) =>
        i === 0 ?
          j === 0 ?
            '' :
            numberToLetter(j) :
          j === 0 ?
            `${i}` :
            ``
    )))
  );
  settings: Partial<Settings> = {
    // deleteCol: false,
    // deleteRow: false,
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
