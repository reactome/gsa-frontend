import {Component, Input, OnInit} from '@angular/core';
import {LoadDatasetService} from "../../../services/load-dataset.service";
import {AnalysisObject} from "../../../model/analysisObject.model";

@Component({
  selector: 'gsa-loading-progress',
  templateUrl: './loading-progress.component.html',
  styleUrls: ['./loading-progress.component.scss']
})
export class LoadingProgressComponent implements OnInit {
  @Input() analysisObject : AnalysisObject
  constructor(public loadDataService : LoadDatasetService) { }

  ngOnInit(): void {
  }

}
