import {Component, Input, OnInit} from '@angular/core';
import {LocalDataset} from "../../../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../../../services/fetch-dataset.service";
import {HttpClient} from "@angular/common/http";
import {LoadDatasetService} from "../../../../services/load-dataset.service";
import {AnalysisObject} from "../../../../model/analysisObject.model";

@Component({
  selector: 'gsa-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss']
})
export class LocalDataComponent implements OnInit {
  @Input() analysisObject : AnalysisObject
  @Input() data: LocalDataset;

  fileName = '';


  constructor(public dataService: FetchDatasetService, private http: HttpClient, private  loadDataService : LoadDatasetService) {
  }

  ngOnInit(): void {
  }

  select() {
    this.dataService.chooseDataset = this.data;

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.loadDataService.uploadFile(file, this.analysisObject)
    }
  }
}
