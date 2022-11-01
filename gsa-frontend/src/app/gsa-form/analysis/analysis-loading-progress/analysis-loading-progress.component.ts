import { Component, OnInit } from '@angular/core';
import {AnalysisService} from "../../services/analysis.service";

@Component({
  selector: 'gsa-analysis-loading-progress',
  templateUrl: './analysis-loading-progress.component.html',
  styleUrls: ['./analysis-loading-progress.component.scss']
})
export class AnalysisLoadingProgressComponent implements OnInit {

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
  }

}
