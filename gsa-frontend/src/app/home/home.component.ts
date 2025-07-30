import {Component} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {Observable} from "rxjs";
import {Settings} from "reactome-table";
import {TourUtilsService, HeightService} from "reactome-gsa-form";

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
    importMapHeaders: false,
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

}

function range(from: number, to: number) {
  return new Array(to - from).fill(0).map((_, i) => from + i);
}
