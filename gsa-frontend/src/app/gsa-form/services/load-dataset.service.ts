import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Dataset, ExampleDataset} from "../model/fetch-dataset.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Method} from "../model/methods.model";
import {DataSummary, LoadingStatus} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";
import {Validators} from "@angular/forms";
import {CellValue} from "handsontable/common";
import {CellInfo} from "../model/table.model";

@Injectable({
  providedIn: 'root'
})
export class LoadDatasetService {
  loadDataUrl = `${environment.ApiRoot}/data/load/`;
  loadingStatusUrl = `${environment.ApiRoot}/data/status/`;
  summaryDataUrl = `${environment.ApiRoot}/data/summary/`;
  uploadDataUrl = `${environment.ApiSecretRoot}/upload`;
  loadingId: string
  loadingStatus: LoadingStatus
  dataSummary: DataSummary
  private timer: NodeJS.Timer;
  columns: string[] = []
  rows: string[] = []
  dataset: CellInfo[][] = []
  loadingProgress: string = 'not started'

  chosenDatasets: Dataset[];

  constructor(private http: HttpClient) {
  }

  loadDataset(resourceId: string, postParameters: any): void {
    this.loadingProgress = 'loading'
    console.log(postParameters)
    this.timer = setInterval(() => this.getLoadingStatus(), 1000)
    this.getLoadingId(resourceId, postParameters)
  }

  getLoadingId(resourceId: string, postParameters: any): void {
    console.log(typeof postParameters)
    this.http.post(this.loadDataUrl + resourceId, postParameters, {responseType: 'text'}).subscribe(
      response => this.loadingId = response)
  }

  getLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingId)
      .subscribe((status) => this.loadingStatus = status)

    if (this.loadingStatus !== undefined && this.loadingStatus.status === 'complete') {
      clearInterval(this.timer);
      this.getDataSummary()
      this.loadingProgress = 'completed'

    }
    if (this.loadingStatus !== undefined && this.loadingStatus.status === 'failed') {
      clearInterval(this.timer);
      this.loadingProgress = 'failed'
    }
  }

  getDataSummary(): void {
    this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus.dataset_id)
      .subscribe((summary) => this.dataSummary = summary)
  }

  uploadFile(file: File): Observable<UploadData> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let uploadDataObservable = this.http.post<UploadData>(this.uploadDataUrl, formData);
    uploadDataObservable.subscribe(response => console.log(response))
    return uploadDataObservable
  }

  computeTableValues() {
    this.rows = this.dataSummary.sample_ids.map(id => id.toLowerCase());
    this.dataset = this.dataSummary.sample_metadata[0].values.map(() => []);
    this.columns = this.dataSummary.sample_metadata.map(data => {
      data.values.forEach((value, i) => this.dataset[i % this.rows.length].push(new CellInfo(value, false)))
      return data.name.toLowerCase();
    })
    console.log(this.dataset)
    console.log(this.rows)
    console.log(this.columns)
  }
}
