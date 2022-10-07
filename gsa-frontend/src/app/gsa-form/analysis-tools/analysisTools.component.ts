import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Tool} from "../model/tool.model";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-analysis-tools',
  templateUrl: './analysisTools.component.html',
  styleUrls: ['./analysisTools.component.css']
})
export class AnalysisToolsComponent implements OnInit{
  tools_url = `${environment.ApiRoot}/methods`;
  tools?: Observable<Tool[]>;


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    // let params = new HttpParams().set('id', 12)
    this.tools = this.http.get<Tool[]>(this.tools_url);
  }

}
