import {Component, input} from '@angular/core';
import {PDatasetSource} from "../../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {datasetSourceActions} from "../../../../../state/dataset-source/dataset-source.action";
import {datasetActions} from "../../../../../state/dataset/dataset.actions";
import {DownloadDatasetService} from "../../../../../services/download-dataset.service";
import {TourUtilsService} from "../../../../../global-services/tour-utils.service";

@Component({
    selector: 'gsa-example-data',
    templateUrl: './example-data.component.html',
    styleUrls: ['./example-data.component.scss'],
    standalone: false
})
export class ExampleDataComponent {
  readonly source = input.required<PDatasetSource>();
  readonly datasetId = input.required<number>();

  constructor(public store: Store, private tour: TourUtilsService, public download: DownloadDatasetService) {
  }

  select() {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source()}));
    this.loadData();
  }

  loadData() {
    if (this.tour.on) this.tour.pause();
    this.store.dispatch(datasetActions.load({
      id: this.datasetId(), resourceId: 'example_datasets', parameters: [{
        name: "dataset_id",
        value: this.source().id
      }]
    }))
  }
}
