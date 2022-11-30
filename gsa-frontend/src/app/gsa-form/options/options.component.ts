import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {MethodParameter} from "../model/methods.model";

@Component({
  selector: 'gsa-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  analysisOptionsStep: FormGroup;


  constructor(private formBuilder: FormBuilder, public analysisMethodsService: AnalysisMethodsService) {
    this.analysisOptionsStep = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  getDisplayParameters(): MethodParameter[] {

    return this.analysisMethodsService.selectedMethod?.parameters.filter(p => p.scope === 'common') || [];
  }
}
