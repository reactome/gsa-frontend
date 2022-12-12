import {Component, Input} from '@angular/core';
import {Method} from "../../model/methods.model"
import {AnalysisMethodsService} from "../../services/analysis-methods.service";

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent {
  @Input() method: Method
  expanded: boolean = false

  constructor(public analysisMethodService: AnalysisMethodsService) {
  }

  getDisplayParameters() {
    return this.method.parameters.filter(p => p.scope !== 'common');
  }

  selectMethod() {
    this.analysisMethodService.selectedMethod = this.method;
    this.expanded = !this.expanded
    console.log(this.expanded)
  }
}
