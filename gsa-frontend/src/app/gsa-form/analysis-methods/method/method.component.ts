import {Component, Input, OnInit} from '@angular/core';
import {Method} from "../../model/methods.model"
import {Router} from "@angular/router";
import {AnalysisMethodsService} from "../../services/analysis-methods.service";

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit {
  @Input() method: Method
  showConfig = false
  filteredParameters: any;
  chooseMethod : boolean = false


  constructor(private router: Router, public methodService: AnalysisMethodsService) { }

  getDisplayParameters() {
    return this.method.parameters.filter(p => p.scope !== 'common');
  }

  ngOnInit(): void {
    this.filteredParameters = this.method.parameters.filter(p => p.scope !== 'common');
  }

  toggleConfiguration() {
    this.showConfig = ! this.showConfig;
  }

  selectMethod() {
    this.methodService.selectedMethod = this.method;
    // this.router.navigate(['/selectDataset']);
    this.chooseMethod = !this.chooseMethod
  }
}
