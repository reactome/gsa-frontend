import {Component, Input} from '@angular/core';
import {LocalDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {HttpClient} from "@angular/common/http";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {Dataset} from "../../../../model/dataset.model";

@Component({
  selector: 'gsa-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss']
})
export class LocalDataComponent {
  @Input() dataset: Dataset;
  @Input() data: LocalDataset;

  constructor(public fetchDatasetService: FetchDatasetService, private http: HttpClient, private loadDatasetService: LoadDatasetService) {
  }

  select() {
    this.fetchDatasetService.chosenDataset = this.data;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loadDatasetService.uploadFile(file, this.dataset)
    }
  }
}
