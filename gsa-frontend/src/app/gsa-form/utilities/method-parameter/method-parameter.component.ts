import {Component, Input, OnInit} from '@angular/core';
import {methodParameter, ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'gsa-method-parameter',
  templateUrl: './method-parameter.component.html',
  styleUrls: ['./method-parameter.component.scss']
})
export class MethodParameterComponent implements OnInit {
  @Input() parameter: methodParameter;
  types = ParameterType;
  isSmall: boolean = false

  constructor(private responsive: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium])
      .subscribe(result => {

        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.Small] || breakpoints[Breakpoints.XSmall]) {
          this.isSmall = true
        }
        else if (breakpoints[Breakpoints.Medium]) {
          this.isSmall = false
        }

      });
  }

}
