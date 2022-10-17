import {Component, Input, OnInit} from '@angular/core';
import {ExampleDataset, LocalDataset} from "../../model/fetch-dataset.model";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {HttpClient} from "@angular/common/http";
import {LoadDatasetService} from "../../services/load-dataset.service";

@Component({
  selector: 'gsa-local-data',
  templateUrl: './local-data.component.html',
  styleUrls: ['./local-data.component.scss']
})
export class LocalDataComponent implements OnInit {
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
      const formData = new FormData();
      formData.append("thumbnail", file);
      this.loadDataService.uploadFile(formData)
    }
  }
}
