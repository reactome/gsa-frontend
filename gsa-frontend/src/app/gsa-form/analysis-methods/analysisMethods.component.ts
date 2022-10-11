import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Method} from "../model/methods.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysisMethods.component.html',
  styleUrls: ['./analysisMethods.component.scss']
})
export class AnalysisMethodsComponent implements OnInit{
  methods_url = `${environment.ApiRoot}/methods`;
  methods?: Observable<Method[]>;



  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    // let params = new HttpParams().set('id', 12)
    this.methods = this.http.get<Method[]>(this.methods_url);
    this.methods.subscribe(value => console.log(value))
  }





}
