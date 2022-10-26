import {Component, Input, OnInit} from '@angular/core';
import {importParameter} from "../../../../model/fetch-dataset.model";
import {ParameterType} from "../../../../model/methods.model";


@Component({
  selector: 'gsa-import-parameter',
  templateUrl: './import-parameter.component.html',
  styleUrls: ['./import-parameter.component.scss']
})
export class ImportParameterComponent implements OnInit {

  @Input() parameter: importParameter;
  types = ParameterType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
