import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {StatisticalDesignService} from "../../services/statistical-design.service";

@Component({
  selector: 'gsa-statistical-design',
  templateUrl: './statistical-design.component.html',
  styleUrls: ['./statistical-design.component.scss']
})
export class StatisticalDesignComponent implements OnInit {

  frmStepTwoThree: FormGroup;

  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService, public statisticalDesignService: StatisticalDesignService) {
    this.frmStepTwoThree = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  computeColumnValues(): any[] {
    let colIndex = this.loadDataService.columns.indexOf(this.statisticalDesignService.analysisGroup)
    let colValues : any[] = []
    this.loadDataService.dataset.forEach((row) => {
      if (colValues.indexOf(row[colIndex].value) === -1) {
        colValues.push(row[colIndex].value)
      }
    })
    return colValues;
  }
}
