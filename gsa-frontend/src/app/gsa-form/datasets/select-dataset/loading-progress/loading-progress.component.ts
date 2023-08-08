import {Component, Inject, Input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {datasetFeature} from "../../../state/dataset/dataset.selector";
import {filter, map, Observable, tap} from "rxjs";
import {PLoadingStatus} from "../../../model/load-dataset.model";
import {isDefined} from "../../../utilities/utils";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'gsa-loading-progress',
  templateUrl: './loading-progress.component.html',
  styleUrls: ['./loading-progress.component.scss']
})
export class LoadingProgressComponent implements OnInit {

  loadingStatus$: Observable<PLoadingStatus>


  constructor(
    public store: Store,
    @Inject(MAT_DIALOG_DATA) public data: { datasetId: number }) {
  }

  ngOnInit(): void {
    this.loadingStatus$ = this.store.select(datasetFeature.selectDataset(this.data.datasetId)).pipe(
      map(dataset => dataset?.loadingStatus),
      filter(isDefined),
    )
  }


}
