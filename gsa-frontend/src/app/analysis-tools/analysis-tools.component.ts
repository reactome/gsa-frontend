import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Tool} from "./tool";

class Post {
}

@Component({
  selector: 'app-analysis-tools',
  templateUrl: './analysis-tools.component.html',
  styleUrls: ['./analysis-tools.component.css']
})
export class AnalysisToolsComponent {
  tools_url = 'http://gsa.reactome.org/0.1/methods'
  tools?: Observable<Tool[]>
  title = 'JSON Try';

  constructor(private http: HttpClient) {
  }

  getPosts() {
    let params = new HttpParams().set('id', 12)
    this.tools = this.http.get<Tool[]>(this.tools_url, {params})
  }

}
