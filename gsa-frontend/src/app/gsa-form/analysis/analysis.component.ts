import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisService} from "../services/analysis.service";

@Component({
  selector: 'gsa-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
  analysisStep: FormGroup;

  constructor(private formBuilder: FormBuilder, public analysisService: AnalysisService) {
    this.analysisStep = this.formBuilder.group({
      name: ['', Validators.required]
    });

  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
