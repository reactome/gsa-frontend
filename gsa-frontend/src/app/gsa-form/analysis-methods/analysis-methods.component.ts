import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Method} from "../model/methods.model";
import {AnalysisMethodsService} from "./analysis-methods.service";

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss'],
  providers: [AnalysisMethodsService]
})
export class AnalysisMethodsComponent implements OnInit{
  methods?: Observable<Method[]>;

  constructor(private methodService: AnalysisMethodsService) {
  }

  ngOnInit(): void {
    this.methods = this.methodService.getAnalysisMethods()
  }
}
