import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsService} from "../services/analysis-methods.service";

@Component({
  selector: 'gsa-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  frmStepThree: FormGroup;



  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.frmStepThree = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  getDisplayParameters() {
    return this.methodService.selectedMethod.parameters.filter(p => p.scope === 'common');
  }

  ngOnInit(): void {
  }

}
