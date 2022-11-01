import {Component, Input, OnInit} from '@angular/core';
import {methodParameter, ParameterJSON, ParameterType} from "../../model/methods.model";

@Component({
  selector: 'gsa-method-parameter',
  templateUrl: './method-parameter.component.html',
  styleUrls: ['./method-parameter.component.scss']
})
export class MethodParameterComponent implements OnInit {
  @Input() parameter: methodParameter;
  types = ParameterType;

  constructor() {

  }

  ngOnInit(): void {
  }

}
