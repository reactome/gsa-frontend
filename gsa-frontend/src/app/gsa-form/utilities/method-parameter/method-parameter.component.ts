import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, TrackByFunction} from '@angular/core';
import {ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Parameter} from "../../model/parameter.model";


export const paramTracker: TrackByFunction<Parameter> = (i, param) => param.value;

@UntilDestroy()
@Component({
    selector: 'gsa-method-parameter',
    templateUrl: './method-parameter.component.html',
    styleUrls: ['./method-parameter.component.scss'],
    standalone: false
})
export class MethodParameterComponent implements OnInit, OnChanges {
  @Input() parameter: Parameter;
  @Input() infoTooltip: boolean = true;
  types = ParameterType;
  screenIsSmall$: Observable<boolean>;

  control = new FormControl('', {
    validators: [],
    updateOn: 'blur'
  });


  @Output() parameterChange: Observable<Parameter> = this.control.valueChanges.pipe(
    map(value => ({...this.parameter, value})),
  )

  constructor(private responsive: BreakpointObserver) {
  }

  ngOnInit(): void {
    if (this.parameter.type === 'email' || this.parameter.name.toLowerCase().includes('email')) {
      this.control.addValidators([Validators.email])
    }

    this.control.setValue(this.parameter.value, {emitEvent: false});
    this.screenIsSmall$ = this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(res => res.matches));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const paramChange = changes['parameter'];
    if (paramChange) this.control.setValue(this.parameter.value, {emitEvent: false});
  }
}
