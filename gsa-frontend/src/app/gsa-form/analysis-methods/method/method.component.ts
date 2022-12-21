import {Component, Input} from '@angular/core';
import {Method} from "../../model/methods.model"
import {AnalysisMethodsService} from "../../services/analysis-methods.service";
import {ScrollService} from "../../services/scroll.service";

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent {
  @Input() method: Method
  expanded: boolean = false

  constructor(public analysisMethodService: AnalysisMethodsService, private scrollService: ScrollService) {
  }

  getDisplayParameters() {
    return this.method.parameters.filter(p => p.scope !== 'common');
  }

  selectMethod() {
    this.analysisMethodService.selectedMethod = this.method;

  }

  setToDefault() {

    this.method.parameters.forEach(param => {
      this.analysisMethodService.parseParamDefaultValue(param)
    })
  }

  updateScroll() {
    setTimeout(() => this.scrollService.triggerResize(), 120);
  }
}
