import {Injectable} from '@angular/core';
import {Method} from "../model/methods.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnalysisMethodsService {
  methodsUrl = `${environment.ApiRoot}/methods`;
  selectedMethod: Method;

  constructor(private http: HttpClient) {
  }

  getAnalysisMethods(): Observable<Method[]> {
    return this.http.get<Method[]>(this.methodsUrl)
      .pipe(map((methods: Method[]) => {
      return methods.map(value => new Method(value.name, value.description, value.parameters));
    }));
  }
}
