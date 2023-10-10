import {Component, Input} from '@angular/core';
import {PDatasetSource} from "../../../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {datasetSourceActions} from "../../../../../state/dataset-source/dataset-source.action";
import {datasetActions} from "../../../../../state/dataset/dataset.actions";
import {TourService} from "ngx-ui-tour-md-menu";
import {TourUtilsService} from "../../../../../../services/tour-utils.service";

@Component({
  selector: 'gsa-example-data',
  templateUrl: './example-data.component.html',
  styleUrls: ['./example-data.component.scss']
})
export class ExampleDataComponent {
  @Input() source: PDatasetSource;
  @Input() datasetId: number;

  constructor(public store: Store, private tour: TourUtilsService) {
  }

  select() {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
    this.loadData();
  }

  loadData() {
    if (this.tour.on) this.tour.pause();
    this.store.dispatch(datasetActions.load({
      id: this.datasetId, resourceId: 'example_datasets', parameters: [{
        name: "dataset_id",
        value: this.source.id
      }]
    }))
  }
}
