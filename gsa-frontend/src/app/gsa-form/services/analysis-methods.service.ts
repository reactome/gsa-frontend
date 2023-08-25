import {Injectable} from '@angular/core';
import {Method} from "../model/methods.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export const typeToParse: { [p: string]: (value: string) => any } = {
  bool: value => value.toLowerCase() === 'true',
  float: parseFloat,
  int: parseInt,
  email: value => value,
  string: value => value
}

@Injectable({providedIn: 'root'})
export class AnalysisMethodsService {
  methodsUrl = `${environment.ApiRoot}/methods`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Method[]> {
    return this.http.get<Method[]>(this.methodsUrl)
  }
}
