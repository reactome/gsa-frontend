import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataSummary, LoadingStatus, LoadParameter} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";

import {Dataset, DatasetTable} from "../model/dataset.model";
import {MatStepper} from "@angular/material/stepper";
import {CellInfo} from "../model/table.model";
import {LoadingProgressComponent} from "../datasets/select-dataset/loading-progress/loading-progress.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class LoadDatasetService {
  stepper: MatStepper;
  loadDataUrl = `${environment.ApiRoot}/data/load/`;
  loadingStatusUrl = `${environment.ApiRoot}/data/status/`;
  summaryDataUrl = `${environment.ApiRoot}/data/summary/`;
  uploadDataUrl = `${environment.ApiSecretRoot}/upload`;
  loadingID?: string;
  loadingStatus?: LoadingStatus;
  private timer: NodeJS.Timer;

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  loadDataset(resourceId: string, postParameters: LoadParameter[], dataset: Dataset): void {
    // @ts-ignore
    this.loadingStatus = {
      status: "running"
    }
    this.submitQuery(resourceId, postParameters);
    this.showLoadingDialog()
    this.timer = setInterval(() => this.waitForResult(dataset), 1000);
  }

  showLoadingDialog() {
    const dialogRef = this.dialog.open(LoadingProgressComponent, {
      width: '50%',
      height: '50%',
      disableClose: true
    });
    this.timer = setInterval(() => {
      if (this.loadingStatus?.status === "complete") {
        dialogRef.close();
      }
    }, 500);
  }

  submitQuery(resourceId: string, postParameters: any): void {
    this.http.post(this.loadDataUrl + resourceId, postParameters, {responseType: 'text'}).subscribe(
      response => this.loadingID = response);
  }

  processDataSummary(dataset: Dataset): void {
    this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus?.dataset_id)
      .subscribe((summary) => {
        dataset.summary = summary;
        this.computeTableValues(dataset);
      })
  }

  computeTableValues(newData: Dataset) {
    let rows: string[] = newData.summary!.sample_ids!.map(id => id);
    let dataset: CellInfo[][] = newData.summary!.sample_metadata![0].values.map(() => []);
    let columns: string[] = newData.summary!.sample_metadata!.map(data => {
      data.values.forEach((value, i) =>
        dataset[i % rows.length].push(new CellInfo(value)));
      return data.name;
    })
    newData.table = new DatasetTable(columns, rows, dataset);
    setTimeout(() => {
      this.stepper.next();
    }, 0);
  }

  uploadFile(file: File, newData: Dataset): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let uploadDataObservable = this.http.post<UploadData>(this.uploadDataUrl, formData);
    uploadDataObservable.subscribe(response => {

        let dataSummary: DataSummary = {
          id: this.loadingID!,
          title: file.name,
          type: "test",
          default_parameters: []
        }
        newData.summary = dataSummary


        let rows: string[] = response.sample_names;
        let columns: string[] = ["Annotation1"];
        let dataset: CellInfo[][] = rows.map(() => [new CellInfo()]);
        newData.table = new DatasetTable(columns, rows, dataset);

        setTimeout(() => {
          this.stepper.next();
        }, 0);

      }
    )
  }

  private waitForResult(dataset: Dataset): void {
    this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingID)
      .subscribe((status) => {
        this.loadingStatus = status;
        switch (this.loadingStatus?.status) {
          case 'failed':
            clearInterval(this.timer);
            break;
          case "complete":
            clearInterval(this.timer);
            this.processDataSummary(dataset);
            break;
        }
      })
  }
}
