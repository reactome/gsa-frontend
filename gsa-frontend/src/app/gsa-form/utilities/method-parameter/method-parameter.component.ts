import {Component, Input, OnInit, Output, TrackByFunction} from '@angular/core';
import {ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Parameter} from "../../model/parameter.model";


export const paramTracker: TrackByFunction<Parameter> = (i, param) => param.name;

@UntilDestroy()
@Component({
  selector: 'gsa-method-parameter',
  templateUrl: './method-parameter.component.html',
  styleUrls: ['./method-parameter.component.scss']
})
export class MethodParameterComponent implements OnInit {
  @Input() parameter: Parameter;
  @Input() infoTooltip: boolean = true;

  control = new FormControl('', {
    validators: [],
    updateOn: 'blur'
  });
  types = ParameterType;
  screenIsSmall$: Observable<boolean>;

  @Output() parameterChange: Observable<Parameter> = this.control.valueChanges.pipe(
    // tap(x => console.log('update', x)),
    map(value => ({...this.parameter, value})),
  );


  constructor(private responsive: BreakpointObserver) {
  }

  ngOnInit(): void {
    if (this.parameter.type === 'email' || this.parameter.name.toLowerCase().includes('email')) {
      this.control.addValidators([Validators.email])
    }

    this.control.setValue(this.parameter.value, {emitEvent: false});
    this.screenIsSmall$ = this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(res => res.matches));
  }
}
