import {Component, Input, OnInit} from '@angular/core';
import {Parameter, ParameterJSON, ParameterType} from "../../model/methods.model";

@Component({
  selector: 'gsa-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit {
  @Input() parameter: Parameter;
  types = ParameterType;

  constructor() {

  }

  ngOnInit(): void {
    console.log(this.parameter)
  }

}
