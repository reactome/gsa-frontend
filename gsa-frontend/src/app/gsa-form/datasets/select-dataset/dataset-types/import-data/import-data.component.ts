import {Component, Input} from '@angular/core';
import {ImportDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {LoadParameter, LoadParameterClass} from "../../../../model/load-dataset.model";
import {currentDataset} from "../../../../model/analysisObject.model";

@Component({
  selector: 'gsa-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {
  @Input() currentDataset: currentDataset;
  @Input() data: ImportDataset;

  constructor(public fetchDatasetService: FetchDatasetService, public loadDatasetService: LoadDatasetService) {
  }

  select(): void {
    this.fetchDatasetService.chosenDataset = this.data;
  }


  loadData(): void {
    let loadParams: LoadParameter[] = this.data.parameters.map(param =>
      new LoadParameterClass(param.name, param.value.toString())
    );
    this.loadDatasetService.loadDataset(this.data.id, loadParams, this.currentDataset);
  }
}


