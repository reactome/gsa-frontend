import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Method} from "../model/methods.model";
import {environment} from "../../../environments/environment";
import {AnalysisMethodsService} from "./analysis-methods.service";

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss'],
  providers: [AnalysisMethodsService]
})
export class AnalysisMethodsComponent implements OnInit{
  methods?: Observable<Method[]>;

  constructor(private http: HttpClient, private methodService: AnalysisMethodsService) {
  }

  ngOnInit(): void {
    this.methods = this.methodService.getAnalysisMethods()
  }
}
