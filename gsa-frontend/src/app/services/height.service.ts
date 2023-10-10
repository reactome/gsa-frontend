import { Injectable } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeightService {
  sizes = {
    medium: '(min-height:500px)',
    big: '(min-height:800px)'
  }

  size$ = this.observer.observe([
    this.sizes.medium,
    this.sizes.big
  ]);

  medium$ = this.size$.pipe(map(state => state.breakpoints[this.sizes.medium]));
  big$ = this.size$.pipe(map(state => state.breakpoints[this.sizes.big]));
  constructor(private observer: BreakpointObserver) {
  }
}
