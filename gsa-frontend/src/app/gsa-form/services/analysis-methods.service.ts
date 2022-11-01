import {Injectable} from '@angular/core';
import {Method, methodParameter, ParameterJSON, ParameterType} from "../model/methods.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {DataSummary} from "../model/load-dataset.model";

@Injectable({
  providedIn: 'root'
})
export class AnalysisMethodsService {
  static test = 0;
  id: number;
  methodsUrl = `${environment.ApiRoot}/methods`;
  methods : Method[];
  selectedMethod: Method;

  constructor(private http: HttpClient) {
    this.id = AnalysisMethodsService.test++;
  }

  getAnalysisMethods(): void {
    this.http.get<Method[]>(this.methodsUrl).subscribe((methods) => {
      this.methods = methods;
      this.methods.forEach((method) => method.parameters.forEach((param) => {
        this.parseParamDefaultValue(param)
      }))
    })
  }

  parseParamDefaultValue(param: methodParameter) {
    switch (param.type) {
      case ParameterType.bool:
        param.value = param.default.toLowerCase() === "true";
        break
      case ParameterType.float:
        param.value = parseFloat(param.default);
        break;
      case ParameterType.int:
        param.value = parseInt(param.default);
        break;
      default:
        param.value = param.default;
    }
  }
}
