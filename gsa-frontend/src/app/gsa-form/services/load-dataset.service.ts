import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Dataset, ExampleDataset} from "../model/fetch-dataset.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Method} from "../model/methods.model";
import {DataSummary, LoadingStatus} from "../model/load-dataset.model";

@Injectable({
  providedIn: 'root'
})
export class LoadDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/load/example_datasets`;
  loadingStatusUrl = `${environment.ApiRoot}/data/status/`;
  summaryDataUrl = `${environment.ApiRoot}/data/summary/`;
  uploadDataUrl = `${environment.ApiRoot}/upload`;
  loadingId: string
  loadingStatus: LoadingStatus
  dataSummary: DataSummary
  private timer: NodeJS.Timer;
  chosenDatasets: Dataset[];

  constructor(private http: HttpClient) {
  }

  loadDataset(postParameters: any): void {
    this.timer = setInterval(() => this.getLoadingStatus(), 1000)
    this.getLoadingId(postParameters)

  }

  getLoadingId(postParameters: any): void {
    this.http.post(this.exampleDataUrl, postParameters, {responseType: 'text'}).subscribe(
      response => this.loadingId = response)
  }

  getLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingId)
      .subscribe((status) => this.loadingStatus = status)

    if (this.loadingStatus !== undefined && this.loadingStatus.status === 'complete') {
      clearInterval(this.timer);
      this.getDataSummary()
    }
  }

  getDataSummary(): void {
    this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus.dataset_id)
      .subscribe((summary) => this.dataSummary = summary)
  }

  uploadFile(formData : FormData): void {
    this.http.post(this.exampleDataUrl, formData, {responseType: 'text'}).subscribe(
      response => console.log(response))
  }
}
