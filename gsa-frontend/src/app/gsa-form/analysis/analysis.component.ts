import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsService} from "../services/analysis-methods.service";

@Component({
  selector: 'gsa-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  frmStepFour: FormGroup;



  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.frmStepFour = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
  }
}
