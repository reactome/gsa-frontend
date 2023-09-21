import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Observable, tap} from "rxjs";

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

  constructor(breakpointObserver: BreakpointObserver ) {
    this.screenSize$ = breakpointObserver.observe([
      this.sizes.Small,
      this.sizes.Medium
    ]);
  }

}
