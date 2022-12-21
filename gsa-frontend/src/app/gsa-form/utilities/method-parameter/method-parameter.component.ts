import {Component, Input, OnInit} from '@angular/core';
import {MethodParameter, ParameterType} from "../../model/methods.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";

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
  @Input() parameter: MethodParameter;
  @Input() index: number;
  types = ParameterType;
  screenIsSmall: boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();


  constructor(private responsive: BreakpointObserver) {
  }

  setValue($event: any, parameter: MethodParameter): void {
    parameter.value = $event.target.value;
    console.log($event.target)
    this.emailFormControl.setValue($event.target.value)
    console.log(this.emailFormControl.value)
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
