import {Component, Input, OnInit} from '@angular/core';
import {ParameterType} from "../../../../../model/methods.model";
import {Parameter} from "../../../../../state/parameter/parameter.state";


@Component({
  selector: 'gsa-external-parameter',
  templateUrl: './external-parameter.component.html',
  styleUrls: ['./external-parameter.component.scss']
})
export class ExternalParameterComponent implements OnInit {

  @Input() parameter: Parameter;
  types = ParameterType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
