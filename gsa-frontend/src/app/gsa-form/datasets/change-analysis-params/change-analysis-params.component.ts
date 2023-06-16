import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Dataset} from "../../model/dataset.model";

import {AnalysisMethodsService} from "../../services/analysis-methods.service";


@Component({
  selector: 'gsa-change-analysis-params',
  templateUrl: './change-analysis-params.component.html',
  styleUrls: ['./change-analysis-params.component.scss']
})
export class ChangeAnalysisParamsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { dataset: Dataset }, public analysisMethodsService: AnalysisMethodsService) {
  }

  ngOnInit(): void {
    this.setToDefault()
  }

  setToDefault() {
    this.data.dataset.summary!.parameters = this.analysisMethodsService.selectedMethod?.parameters.filter(para =>
      para.scope !== "common").map(param => {
      return Object.assign({}, param)
    })
  }
}
