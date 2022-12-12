import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Dataset} from "../../model/dataset.model";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit {
  @Input() dataset: Dataset
  statisticalDesignStep: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.statisticalDesignStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.dataset.statisticalDesign === undefined) {
      this.dataset.statisticalDesign = {
        analysisGroup: this.defaultValue(0),
        comparisonGroup1: this.defaultValue(1),
        comparisonGroup2: this.defaultValue(2),
        covariances: []
      };
      this.dataset.statisticalDesign.covariances = this.computeValidColumns().filter(covariate => this.defaultCovariate(covariate));
    }
  }

  getColumn(colName: any): any[] {
    let colIndex = this.dataset.table!.columns.indexOf(colName);
    return this.dataset.table?.dataset.map(row => row[colIndex].value) || [];
  }

  computeColumnValues(colName: string | undefined, group: string): string[] {
    let colValues: string[] = this.getColumn(colName);
    colValues = colValues.filter((item, index) => colValues.indexOf(item) === index && item !== "");
    switch (group) {
      case 'first':
        if (colValues.indexOf(<string>this.dataset.statisticalDesign!.comparisonGroup1) === -1) {
          this.dataset.statisticalDesign!.comparisonGroup1 = undefined;
        }
        break;
      case 'second':
        if (colValues.indexOf(<string>this.dataset.statisticalDesign!.comparisonGroup2) === -1) {
          this.dataset.statisticalDesign!.comparisonGroup2 = undefined;
        }
        break;
    }
    // colValues.splice(colValues.indexOf(""), 1)
    return colValues;
  }

  computeValidColumns(): string[] {
    return this.dataset.table!.columns.filter((colName) => this.computeColumnValues(colName, "default").length > 1);
  }

  defaultValue(index: number): string | undefined {
    if (this.defaultStillInTable(index)) {
      return this.dataset.summary?.default_parameters[index]?.value;
    }
    return undefined;
  }

  defaultStillInTable(index: number): boolean {
    let defaultValue = this.dataset.summary?.default_parameters[index]?.value;
    switch (index) {
      case 0:
        return this.dataset.table!.columns.indexOf(<string>defaultValue) !== -1;
      case 1 || 2:
        if (this.dataset.statisticalDesign?.analysisGroup !== undefined) {
          return this.computeColumnValues(this.dataset.statisticalDesign?.analysisGroup, 'analysis').indexOf(<string>defaultValue) !== -1;
        }
    }
    return true;
  }


  defaultCovariate(covariate: string): boolean {
    let covariates = this.dataset.summary?.default_parameters[3] !== undefined ? this.dataset.summary!.default_parameters[3].value : "";
    return covariates.split(",").indexOf(covariate) !== -1;
  }

  addCovariate($event: MatCheckboxChange, covariate: string): void {
    if ($event.checked) {
      this.dataset.statisticalDesign!.covariances.push(covariate);
    } else {
      let indexCovariate = this.dataset.statisticalDesign!.covariances.indexOf(covariate);
      this.dataset.statisticalDesign!.covariances.splice(indexCovariate, 1);
    }
  }

  log($event: any) {
    console.log($event)

  }
}
