import { Component, OnInit } from '@angular/core';
import {LoadDatasetService} from "../../../services/load-dataset.service";

@Component({
  selector: 'gsa-loading-progress',
  templateUrl: './loading-progress.component.html',
  styleUrls: ['./loading-progress.component.scss']
})
export class LoadingProgressComponent implements OnInit {

  constructor(public loadDataService : LoadDatasetService) { }

  ngOnInit(): void {
  }

}
