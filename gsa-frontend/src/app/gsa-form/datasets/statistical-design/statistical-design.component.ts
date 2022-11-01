import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {StatisticalDesignService} from "../../services/statistical-design.service";
import {AnalysisService} from "../../services/analysis.service";
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {AnalysisMethodsService} from "../../services/analysis-methods.service";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit {

  frmStepTwoThree: FormGroup;

  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService, public statisticalDesignService: StatisticalDesignService, public analysisInformation: AnalysisService) {
    this.frmStepTwoThree = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  computeColumnValues(): any[] {
    let colName = this.statisticalDesignService.analysisGroup
    let colValues: any[] =this.loadDataService.getColumn(colName);
    return colValues.filter((item, index) => colValues.indexOf(item) === index)
  }


}
