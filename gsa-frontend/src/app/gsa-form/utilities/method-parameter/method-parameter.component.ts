import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {Store} from "@ngrx/store";
import {parameterActions} from "../../state/parameter/parameter.action";
import {Parameter} from "../../state/parameter/parameter.state";
import {map, Observable} from "rxjs";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}


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
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    matcher = new MyErrorStateMatcher();

    constructor(private responsive: BreakpointObserver, private store: Store) {
    }

    update(value: any) {
        // this.store.dispatch(parameterActions.update({
        //   update: {
        //     id: this.parameter.id,
        //     changes: {
        //       value
        //     }
        //   }
        // }))
        this.parameterChange.next({...this.parameter, value})
    }

    setValue($event: any, parameter: Parameter): void {
        // this.parameterChange.next({...this.parameter, value: $event.target.value})
        // parameter.value = $event.target.value;
        // this.emailFormControl.setValue($event.target.value)
    }

    ngOnInit(): void {
        this.screenIsSmall$ = this.responsive.observe(Breakpoints.Small).pipe(map(res => res.matches));
    }
}
