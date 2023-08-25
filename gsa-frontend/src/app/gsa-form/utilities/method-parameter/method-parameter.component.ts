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
  @Output() parameterChange = new EventEmitter<Parameter>();
  types = ParameterType;
  screenIsSmall$: Observable<boolean>;
  control = new FormControl('', {
    validators: [Validators.email],
    updateOn: 'blur'
  });

  options: any = {updateOn: 'blur'}

  constructor(private responsive: BreakpointObserver) {
  }

  update(value: any) {
    this.parameterChange.next({...this.parameter, value})
  }

  ngOnInit(): void {
    this.control.setValue(this.parameter.value);
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe(this.update.bind(this))
    this.screenIsSmall$ = this.responsive.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(res => res.matches));
  }
}
