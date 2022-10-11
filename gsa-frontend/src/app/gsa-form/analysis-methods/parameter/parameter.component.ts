import {Component, Input, OnInit} from '@angular/core';
import {Parameter, ParameterJSON, ParameterType} from "../../model/methods.model";

@Component({
  selector: 'gsa-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() paramDef: ParameterJSON;
  // param: Parameter<any> = {value:this?.paramDef?.default, typethid}
  types = ParameterType;
  param: Parameter;

  constructor() {

  }

  ngOnInit(): void {
    this.param = new Parameter(this.paramDef);
  }

}
