import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {StatisticalDesignService} from "../../services/statistical-design.service";
import {AnalysisService} from "../../services/analysis.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {AnalysisObject} from "../../model/analysisObject.model";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit {
  @Input() analysisObject: AnalysisObject
  frmStepTwoThree: FormGroup;

  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService, public statisticalDesignService: StatisticalDesignService, public analysisInformation: AnalysisService) {
    this.frmStepTwoThree = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.analysisObject.statisticalDesign === undefined) {
      this.analysisObject.statisticalDesign = {
        analysisGroup: this.defaultValue(0),
        comparisonGroup1: this.defaultValue(1),
        comparisonGroup2: this.defaultValue(2),
        covariances: []
      }
      for (let covariate of this.computeValidColumns()) {
        if (this.defaultCovariate(covariate)) {
          this.analysisObject.statisticalDesign.covariances.push(covariate)
        }
      }
    }
  }

  computeColumnValues(colName: string): any[] {
    let colValues: any[] = this.loadDataService.getColumn(colName, this.analysisObject);
    colValues = colValues.filter((item, index) => colValues.indexOf(item) === index)
    return colValues
  }

  computeValidColumns() {
    let cols: string[]
    cols = this.analysisObject.datasetTable!.columns
    cols = cols.filter((colName) => this.computeColumnValues(colName).length > 1)
    return cols;
  }

  defaultValue(index: number) {
    return this.analysisObject.dataset?.default_parameters[1] !== undefined ?
      this.analysisObject.dataset?.default_parameters[index].value :
      "-Select One-";
  }


  defaultCovariate(covariate: string) {
    let covariates = this.analysisObject.dataset?.default_parameters[3] !== undefined ? this.analysisObject.dataset!.default_parameters[3].value : "";
    let defaultCov: string[] = covariates.split(",")
    return defaultCov.indexOf(covariate) !== -1
  }

  addCovariant($event: MatCheckboxChange, covariate: string) {
    if ($event.checked === true) {
      this.analysisObject.statisticalDesign!.covariances.push(covariate)
    } else {
      let indexCovariate = this.analysisObject.statisticalDesign!.covariances.indexOf(covariate)
      this.analysisObject.statisticalDesign!.covariances.splice(indexCovariate, 1)
    }
  }
}
