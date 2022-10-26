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

  frmStepFour: FormGroup;

  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService, public statisticalDesignService: StatisticalDesignService) {
    this.frmStepFour = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

}
