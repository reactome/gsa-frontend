import {Injectable} from '@angular/core';
import {Method, MethodParameter, ParameterType} from "../model/methods.model";
import {Method as NgRxMethod} from "../state/method/method.state";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Parameter} from "../state/parameter/parameter.state";

export interface MethodJSON extends NgRxMethod {
  parameters: Parameter[]
}

export const typeToParse: { [p: string]: (value: string) => any } = {
  bool: value => value.toLowerCase() === 'true',
  float: parseFloat,
  int: parseInt,
  email: value => value,
  string: value => value
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisMethodsService {
  methodsUrl = `${environment.ApiRoot}/methods`;
  methods: Method[];
  selectedMethod?: Method;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  getAll(): Observable<MethodJSON[]> {
    return this.http.get<MethodJSON[]>(this.methodsUrl)
  }

  getAnalysisMethods(): void {
    this.http.get<Method[]>(this.methodsUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The analysis methods could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }))
      .subscribe((methods) => {
        this.methods = methods;
        this.methods.forEach((method) => {
          method.parameters.forEach((param) => this.parseParamDefaultValue(param));
        })
      })
  }

  parseParamDefaultValue(param: MethodParameter): void {
    switch (param.type) {
      case ParameterType.bool:
        param.value = param.default.toLowerCase() === "true";
        if (param.name === 'create_reports') param.value = true
        break;
      case ParameterType.float:
        param.value = parseFloat(param.default);
        break;
      case ParameterType.int:
        param.value = parseInt(param.default);
        break;
      default:

        if (param.name === 'email') param.type = ParameterType.email;

        param.value = param.default;
    }
  }
}
