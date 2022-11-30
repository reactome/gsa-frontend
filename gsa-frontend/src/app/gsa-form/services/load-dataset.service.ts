import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataSummary, LoadingStatus} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";

import {currentDataset, DatasetTable} from "../model/analysisObject.model";
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

  loadDataset(resourceId: string, postParameters: any, currentDataset: currentDataset): void {
    // this.loadingStatus = undefined;
    // @ts-ignore
    this.loadingStatus = {
      status: "running"
    }
    this.submitQuery(resourceId, postParameters);
    this.showLoadingDialog()
    this.timer = setInterval(() => this.waitForResult(currentDataset), 1000);
  }

  showLoadingDialog() {
    const dialogRef = this.dialog.open(LoadingProgressComponent, {
      width: '50%',
      height: '50%'
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

  processDataSummary(currentDataset: currentDataset): void {
    this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus?.dataset_id)
      .subscribe((summary) => {
        currentDataset.summary = summary;
        this.computeTableValues(currentDataset);
      })
  }

  computeTableValues(currentDataset: currentDataset) {
    let rows: string[] = currentDataset.summary!.sample_ids.map(id => id);
    let dataset: CellInfo[][] = currentDataset.summary!.sample_metadata[0].values.map(() => []);
    let columns: string[] = currentDataset.summary!.sample_metadata.map(data => {
      data.values.forEach((value, i) =>
        dataset[i % rows.length].push(new CellInfo(value)));
      return data.name;
    })
    currentDataset.table = new DatasetTable(columns, rows, dataset);
    console.log(this.stepper.selected?.completed)
    setTimeout(() => {
      this.stepper.next();
    }, 0);
  }

  uploadFile(file: File, currentDataset: currentDataset): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let uploadDataObservable = this.http.post<UploadData>(this.uploadDataUrl, formData);
    uploadDataObservable.subscribe(response => {
        let rows: string[] = response.sample_names;
        let columns: string[] = ["Annotation1"];
        let dataset: CellInfo[][] = rows.map(() => [new CellInfo()]);
        currentDataset.table = new DatasetTable(columns, rows, dataset);
        setTimeout(() => {
          this.stepper.next();
        }, 0);

      }
    )
  }

  private waitForResult(currentDataset: currentDataset): void {
    this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingID)
      .subscribe((status) => {
        this.loadingStatus = status;
        switch (this.loadingStatus?.status) {
          case 'failed':
            clearInterval(this.timer);
            break;
          case "complete":
            clearInterval(this.timer);
            this.processDataSummary(currentDataset);
            break;
        }
      })
  }
}
