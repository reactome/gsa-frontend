import {Component, Input} from '@angular/core';
import {ImportDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {LoadParameterClass} from "../../../../model/load-dataset.model";
import {Dataset} from "../../../../model/dataset.model";

@Component({
  selector: 'gsa-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {
  @Input() dataset: Dataset;
  @Input() data: ImportDataset;

  constructor(public fetchDatasetService: FetchDatasetService, public loadDatasetService: LoadDatasetService) {
  }

  select(): void {
    this.fetchDatasetService.chosenDataset = this.data;
  }


  loadData(): void {
    this.loadDatasetService.loadDataset(
      this.data.id,
      this.data.parameters.map(param => new LoadParameterClass(param.name, param.value.toString())),
      this.dataset);
  }
}


