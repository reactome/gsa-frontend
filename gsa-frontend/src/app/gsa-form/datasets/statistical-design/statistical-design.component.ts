import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {currentDataset} from "../../model/analysisObject.model";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit {
  @Input() currentDataset: currentDataset
  statisticalDesignStep: FormGroup;

  constructor(private formBuilder: FormBuilder, public loadDatasetService: LoadDatasetService) {
    this.statisticalDesignStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.currentDataset.statisticalDesign === undefined) {
      this.currentDataset.statisticalDesign = {
        analysisGroup: this.defaultValue(0),
        comparisonGroup1: this.defaultValue(1),
        comparisonGroup2: this.defaultValue(2),
        covariances: []
      };
      this.currentDataset.statisticalDesign.covariances = this.computeValidColumns().filter(covariate => this.defaultCovariate(covariate));
    }
  }

  getColumn(colName: any): any[] {
    let colIndex = this.currentDataset.table!.columns.indexOf(colName);
    return this.currentDataset.table?.dataset.map(row => row[colIndex].value) || [];
  }

  computeColumnValues(colName: string | undefined): string[] {
    let colValues: string[] = this.getColumn(colName);
    colValues = colValues.filter((item, index) => colValues.indexOf(item) === index);
    return colValues;
  }

  computeValidColumns(): string[] {
    return this.currentDataset.table!.columns.filter((colName) => this.computeColumnValues(colName).length > 1);
  }

  defaultValue(index: number) {
    if (this.defaultStillInTable(index)) {
      return this.currentDataset.summary?.default_parameters[index]?.value;
    }
    return undefined;
  }

  defaultStillInTable(index: number): boolean {
    let defaultValue = this.currentDataset.summary?.default_parameters[index].value;
    switch (index) {
      case 0:
        return this.currentDataset.table!.columns.indexOf(<string>defaultValue) !== -1;
      case 1 || 2:
        if (this.currentDataset.statisticalDesign?.analysisGroup !== undefined) {
          return this.computeColumnValues(this.currentDataset.statisticalDesign?.analysisGroup).indexOf(<string>defaultValue) !== -1;
        }
    }
    return true;
  }


  defaultCovariate(covariate: string): boolean {
    let covariates = this.currentDataset.summary?.default_parameters[3] !== undefined ? this.currentDataset.summary!.default_parameters[3].value : "";
    return covariates.split(",").indexOf(covariate) !== -1;
  }

  addCovariate($event: MatCheckboxChange, covariate: string): void {
    if ($event.checked === true) {
      this.currentDataset.statisticalDesign!.covariances.push(covariate);
    } else {
      let indexCovariate = this.currentDataset.statisticalDesign!.covariances.indexOf(covariate);
      this.currentDataset.statisticalDesign!.covariances.splice(indexCovariate, 1);
    }
  }
}
