import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Covariate, Dataset} from "../../model/dataset.model";
import {LoadDatasetService} from "../../services/load-dataset.service";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit, AfterViewInit {
  @Input() dataset: Dataset
  statisticalDesignStep: FormGroup;
  allComplete = false;
  someComplete = false;

  // constructor(private formBuilder: FormBuilder, public loadDatasetService: LoadDatasetService) {
  //   this.statisticalDesignStep = this.formBuilder.group({
  //     address: ['', Validators.required]
  //   });
  // }
  //
  ngOnInit(): void {
  //   if (this.dataset.statisticalDesign === undefined) {
  //     this.dataset.statisticalDesign = {
  //       analysisGroup: this.defaultValue(0),
  //       comparisonGroup1: this.defaultValue(1),
  //       comparisonGroup2: this.defaultValue(2),
  //       covariances: this.loadDatasetService.computeValidColumns(this.dataset).map(covariate => ({
  //         name: covariate,
  //         value: this.isDefaultCovariate(covariate)
  //       }))
  //     };
  //   }
  }

  ngAfterViewInit() {
    // this.updateCompleteness();
  }
  //
  //
  // defaultValue(index: number): string | undefined {
  //   if (this.defaultStillInTable(index)) {
  //     return this.dataset.summary?.default_parameters[index]?.value;
  //   }
  //   return undefined;
  // }
  //
  // defaultStillInTable(index: number): boolean {
  //   let defaultValue = this.dataset.summary?.default_parameters[index]?.value;
  //   switch (index) {
  //     case 0:
  //       return this.dataset.table!.columns.includes(<string>defaultValue);
  //     case 1 || 2:
  //       if (this.dataset.statisticalDesign?.analysisGroup !== undefined) {
  //         return this.loadDatasetService.computeColumnValues(this.dataset, this.dataset.statisticalDesign?.analysisGroup, 'analysis').indexOf(<string>defaultValue) !== -1;
  //       }
  //   }
  //   return true;
  // }
  //
  // isDefaultCovariate(covariate: string): boolean {
  //   let covariates = this.dataset.summary?.default_parameters[3] !== undefined ? this.dataset.summary!.default_parameters[3].value : "";
  //   return covariates.split(",").includes(covariate);
  // }
  //
  // changeAllCovariates(value: boolean) {
  //   this.dataset.statisticalDesign?.covariances.forEach(covariate => covariate.value = value);
  //   this.allComplete = value;
  //   this.someComplete = false;
  // }
  //
  // updateCompleteness() {
  //   this.allComplete = this.validCovariates().every(cov => cov.value);
  //   this.someComplete = this.validCovariates().some(cov => cov.value) && !this.allComplete;
  // }
  //
  // public validCovariates(): Covariate[] {
  //   return this.dataset.statisticalDesign?.covariances.filter(covariate => this.dataset.statisticalDesign?.analysisGroup !== covariate.name) || [];
  // }
}
