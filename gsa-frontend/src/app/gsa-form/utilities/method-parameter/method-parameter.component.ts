import {Component, Input, OnInit} from '@angular/core';
import {MethodParameter, ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'gsa-method-parameter',
  templateUrl: './method-parameter.component.html',
  styleUrls: ['./method-parameter.component.scss']
})
export class MethodParameterComponent implements OnInit {
  @Input() parameter: MethodParameter;
  @Input() index: number;

  types = ParameterType;
  screenIsSmall: boolean = false;

  constructor(private responsive: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.responsive.observe(Breakpoints.Small)
      .subscribe(result => {
        if (result.matches) {
          this.screenIsSmall = true;
        } else this.screenIsSmall = false;
      });
  }

}
