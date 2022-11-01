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
    if (this.defaultValue(0) !== "-Select One-") {
      this.statisticalDesignService.analysisGroup[this.loadDataService.currentDataset] = this.defaultValue(0)
      this.statisticalDesignService.comparisonGroup1[this.loadDataService.currentDataset] = this.defaultValue(1)
      this.statisticalDesignService.comparisonGroup2[this.loadDataService.currentDataset] = this.defaultValue(2)

    }
  }

  computeColumnValues(colName: string): any[] {
    let colValues: any[] =this.loadDataService.getColumn(colName);
    colValues = colValues.filter((item, index) => colValues.indexOf(item) === index)
    return colValues
  }


  defaultValue(index: number) {
    let defaultVal: string
    defaultVal = this.loadDataService.dataSummary[this.loadDataService.currentDataset].default_parameters[1] !== undefined ? this.loadDataService.dataSummary[this.loadDataService.currentDataset].default_parameters[index].value : "-Select One-";
    return defaultVal;
  }

  computeValidColumns() {
    let cols: string[]
    cols = this.loadDataService.columns[this.loadDataService.currentDataset]
    cols = cols.filter((colName) =>this.computeColumnValues(colName).length > 1)
    return cols;
  }

  defaultCovariate(covariate : string) {
    let defaultCov: string[]
    let covariates = this.loadDataService.dataSummary[this.loadDataService.currentDataset].default_parameters[3] !== undefined ? this.loadDataService.dataSummary[this.loadDataService.currentDataset].default_parameters[3].value : "";
    defaultCov = covariates.split(",")
    return defaultCov.indexOf(covariate) !== -1
  }
}
