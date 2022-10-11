import { Injectable } from '@angular/core';
import {Method} from "../model/methods.model";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnalysisMethodsService {
  methods_url = `${environment.ApiRoot}/methods`;
  methods?: Observable<Method[]>;

  constructor(private http: HttpClient) { }

  getAnalysisMethods() {
    // let params = new HttpParams().set('id', 12)
    this.methods = this.http.get<Method[]>(this.methods_url);
    this.methods.subscribe(value => console.log(value))
    return this.methods
  }
}
