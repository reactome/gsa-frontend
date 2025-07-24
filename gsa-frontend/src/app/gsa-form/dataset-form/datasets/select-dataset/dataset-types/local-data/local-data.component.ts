import {Component, Input} from '@angular/core';
import {PDatasetSource} from "../../../../../state/dataset-source/dataset-source.state";
import {datasetSourceActions} from "../../../../../state/dataset-source/dataset-source.action";
import {Store} from "@ngrx/store";
import {datasetActions} from "../../../../../state/dataset/dataset.actions";

@Component({
    selector: 'gsa-local-data',
    templateUrl: './local-data.component.html',
    styleUrls: ['./local-data.component.scss'],
    standalone: false
})
export class LocalDataComponent {
  @Input() source: PDatasetSource;
  @Input() datasetId: number;

  constructor(public store: Store) {
  }

  select() {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.store.dispatch(datasetActions.upload({id: this.datasetId,file, typeId: this.source.id}))

    }
  }
}
