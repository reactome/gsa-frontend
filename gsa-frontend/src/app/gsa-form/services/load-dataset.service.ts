import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataSummary, LoadingStatus} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";
import {CellValue} from "handsontable/common";

import {AnalysisObject} from "../model/analysisObject.model";
import {MatStepper} from "@angular/material/stepper";
import {CellInfo} from "../model/table.model";

@Injectable({
  providedIn: 'root'
})
export class LoadDatasetService {
  stepper: MatStepper
  loadDataUrl = `${environment.ApiRoot}/data/load/`;
  loadingStatusUrl = `${environment.ApiRoot}/data/status/`;
  summaryDataUrl = `${environment.ApiRoot}/data/summary/`;
  uploadDataUrl = `${environment.ApiSecretRoot}/upload`;
  loadingId?: string
  loadingStatus?: LoadingStatus;
  private timer: NodeJS.Timer;
  loadingProgress: string = 'not started';
  // columns: string[] = [
  //   "cell.type",
  //   "cell.group",
  // ]
  // rows: string[] = [
  //   "cluster 1",
  //   "cluster 2",
  //   "cluster 3",
  //   "cluster 4",
  //   "cluster 5",
  //   "cluster 6",
  //   "cluster 7",
  //   "cluster 8",
  //   "cluster 9",
  //   "cluster 10",
  //   "cluster 11",
  //   "cluster 12",
  //   "cluster 13"
  // ]
  // dataset: CellInfo[][] = [
  //   [new CellInfo("Memory 0"), new CellInfo("Normal 0")],
  //   [new CellInfo("Memory 1"), new CellInfo("Normal 1")],
  //   [new CellInfo("Memory 2"), new CellInfo("Normal 2")],
  //   [new CellInfo("Memory 3"), new CellInfo("Normal 3")],
  //   [new CellInfo("Memory 4"), new CellInfo("Normal 4")],
  //   [new CellInfo("Memory 5"), new CellInfo("Normal 5")],
  //   [new CellInfo("Memory 6"), new CellInfo("Normal 6")],
  //   [new CellInfo("Memory 7"), new CellInfo("Normal 7")],
  //   [new CellInfo("Memory 8"), new CellInfo("Normal 8")],
  //   [new CellInfo("Memory 9"), new CellInfo("Normal 9")],
  //   [new CellInfo("Memory 0"), new CellInfo("Normal 0")],
  //   [new CellInfo("Memory 1"), new CellInfo("Normal 1")],
  //   [new CellInfo("Memory 2"), new CellInfo("Normal 2")],
  // ]


  constructor(private http: HttpClient) {
  }

  loadDataset(resourceId: string, postParameters: any, analysisObject: AnalysisObject): void {
    this.loadingProgress = 'loading';
    this.loadingStatus = undefined;
    this.getLoadingId(resourceId, postParameters)
    this.timer = setInterval(() => this.getLoadingStatus(analysisObject), 1000)
  }

  private getLoadingStatus(analysisObject: AnalysisObject): void {
    this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingId)
      .subscribe((status) => {
        this.loadingStatus = status;
        if (this.loadingStatus?.status === 'complete') {
          clearInterval(this.timer);
          this.processDataSummary(analysisObject)
          this.loadingProgress = 'completed'
        }
        if (this.loadingStatus?.status === 'failed') {
          clearInterval(this.timer);
          this.loadingProgress = 'failed'
        }
      })
  }

  getLoadingId(resourceId: string, postParameters: any): void {
    this.http.post(this.loadDataUrl + resourceId, postParameters, {responseType: 'text'}).subscribe(
      response => this.loadingId = response)
  }


  processDataSummary(analysisObject: AnalysisObject): void {
    this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus?.dataset_id)
      .subscribe((summary) => {
        analysisObject.dataset = summary
        this.computeTableValues(analysisObject);
      })
  }

  computeTableValues(analysisObject: AnalysisObject) {
    let rows: string[] = analysisObject.dataset!.sample_ids.map(id => id);
    let dataset: CellValue[][] = analysisObject.dataset!.sample_metadata[0].values.map(() => []);
    let columns: string[] = analysisObject.dataset!.sample_metadata.map(data => {
      data.values.forEach((value, i) =>
        dataset[i % rows.length].push(new CellInfo(value)))
      return data.name;
    })
    analysisObject.datasetTable = {
      rows: rows,
      columns: columns,
      dataset: dataset
    }
    // @ts-ignore
    this.stepper.selected.completed = true;
    this.stepper.next()
  }


  uploadFile(file: File, analysisObject: AnalysisObject): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let uploadDataObservable = this.http.post<UploadData>(this.uploadDataUrl, formData);
    uploadDataObservable.subscribe(response => {
        let rows: string[] = response.sample_names
        let columns: string[] = ["Annotation1"]
        let dataset: CellValue[][] = []
        rows.forEach((row) =>
          dataset.push([new CellInfo()]))
        analysisObject.datasetTable = {
          rows: rows,
          columns: columns,
          dataset: dataset
        }
        // @ts-ignore
        this.stepper.selected.completed = true;
        this.stepper.next()
      }
    )

  }

  getColumn(colName: any, analysisObject: AnalysisObject): any[] {
    let colIndex = analysisObject.datasetTable!.columns.indexOf(colName)
    let colValues: any[] = []
    analysisObject.datasetTable!.dataset.forEach((row) => {
      {
        colValues.push(row[colIndex].value)
      }
    })
    return colValues
  }
}
