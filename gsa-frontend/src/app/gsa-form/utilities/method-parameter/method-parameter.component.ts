import {Component, EventEmitter, Input, OnInit, Output, TrackByFunction} from '@angular/core';
import {ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FormControl, Validators} from "@angular/forms";

import {Store} from "@ngrx/store";
import {Parameter} from "../../state/parameter/parameter.state";
import {map, Observable} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";


export const paramTracker: TrackByFunction<Parameter> = (i, param) => param.name;

@UntilDestroy()
@Component({
  selector: 'gsa-method-parameter',
  templateUrl: './method-parameter.component.html',
  styleUrls: ['./method-parameter.component.scss']
})
export class MethodParameterComponent implements OnInit {
  @Input() parameter: Parameter;
  @Output() parameterChange = new EventEmitter<Parameter>();
  types = ParameterType;
  screenIsSmall$: Observable<boolean>;
  control = new FormControl('', [Validators.email]);
  // matcher = new MyErrorStateMatcher();

  options: any = {updateOn: 'blur'}

  constructor(private responsive: BreakpointObserver, private store: Store) {
  }

  update(value: any) {
    console.log('update', value)
    this.parameterChange.next({...this.parameter, value})
  }

  ngOnInit(): void {
    this.control.setValue(this.parameter.value);
    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe(this.update.bind(this))
    this.screenIsSmall$ = this.responsive.observe(Breakpoints.Small).pipe(map(res => res.matches));
  }
}
