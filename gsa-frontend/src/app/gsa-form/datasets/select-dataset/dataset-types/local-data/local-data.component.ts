import {Component, Input} from '@angular/core';
import {PDatasetSource} from "../../../../state/dataset-source/dataset-source.state";
import {datasetSourceActions} from "../../../../state/dataset-source/dataset-source.action";
import {Store} from "@ngrx/store";
import {datasetActions} from "../../../../state/dataset/dataset.actions";

@Component({
  selector: 'gsa-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss']
})
export class LocalDataComponent {
  @Input() source: PDatasetSource;

  constructor(public store: Store) {
  }

  select() {
    this.store.dispatch(datasetSourceActions.select({toBeSelected: this.source}));
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.store.dispatch(datasetActions.upload({file, typeId: this.source.id}))

    }
  }
}
