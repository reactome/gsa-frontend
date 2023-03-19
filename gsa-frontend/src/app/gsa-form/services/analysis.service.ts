import {Injectable} from '@angular/core';
import {LoadDatasetService} from "./load-dataset.service";
import {AnalysisMethodsService} from "./analysis-methods.service";
import {LoadingStatus} from "../model/load-dataset.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Dataset} from "../model/dataset.model";
import {AnalysisResult} from "../model/analysis-result.model";
import {Request} from "../model/analysis.model";
import {catchError, throwError} from "rxjs";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";


@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  submitAnalysisUrl = `${environment.ApiRoot}/analysis`;
  analysisStatusUrl = `${environment.ApiRoot}/status/`;
  analysisResultUrl = `${environment.ApiRoot}/result/`;
  reportStatusUrl = `${environment.ApiRoot}/report_status/`;
  datasets: Dataset[] = [];
  createReports: boolean = false;
  analysisID?: string;
  analysisLoadingStatus?: LoadingStatus;
  reportLoadingStatus?: LoadingStatus;
  resultURL: string;
  private timer: NodeJS.Timer;

  constructor(private analysisMethodService: AnalysisMethodsService, private loadDataService: LoadDatasetService, private http: HttpClient, private snackBar: MatSnackBar) {
  }

  allDatasetsSaved(): boolean {
    return this.datasets.filter(value => value.saved).length === this.datasets.length && this.datasets.length > 0;
  }

  loadAnalysis(): void {
    this.submitQuery();
    this.timer = setInterval(() => this.getAnalysisLoadingStatus(), 1000);
  }

  submitQuery(): void {
    // @ts-ignore
    // @ts-ignore
    const query: Request.Query = {
      methodName: this.analysisMethodService.selectedMethod?.name || "Method name",
      parameters: this.analysisMethodService.selectedMethod?.parameters.map(param => ({
        name: param.name,
        value: param.value
      })) || [],
      datasets: this.datasets.map(dataset => ({
        data: dataset.summary!.id,
        name: dataset.summary!.title,
        type: dataset.summary!.type,
        parameters: dataset.summary!.parameters?.filter(para => para.scope !== "common").map(param => ({
          name: param.name,
          value: param.value
        })),
        design: {
          analysisGroup: dataset.table!.column(dataset.statisticalDesign!.analysisGroup as string),
          samples: dataset.table!.rows,
          comparison: {
            group1: dataset.statisticalDesign!.comparisonGroup1 as string,
            group2: dataset.statisticalDesign!.comparisonGroup2 as string,
          },
          // [key.name in dataset.statisticalDesign!.covariances]: string;
        },
      })),
    };
    query.datasets.forEach(queryDataset => {
      let origDataset: Dataset = this.findOrigDataset(queryDataset.data);
      origDataset.statisticalDesign?.covariances.filter(covariate => covariate.name !== origDataset.statisticalDesign?.analysisGroup).forEach(cov => {
        queryDataset.design[cov.name] = this.getColumnValues(origDataset, cov.name);
      })
    })
    this.createReports = query.parameters.some(param => param.name === 'create_reports' && param.value);
    this.http.post(this.submitAnalysisUrl, query, {responseType: 'text'})
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The analysis could not be performed: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar']
        });

        clearInterval(this.timer);
        return throwError(err);    //Rethrow it back to component
      }))
      .subscribe(response => this.analysisID = response);
  }

  findOrigDataset(datasetID: string): Dataset {
    return this.datasets.filter(dataset => dataset.summary?.id === datasetID)[0]
  }


  getColumnValues(dataset: Dataset, colName: string): string[] {
    let colIndex = dataset.table!.columns.indexOf(colName);
    return dataset.table?.dataset.map(row => row[colIndex].value) || [];
  }

  processAnalysisResult(): void {
    this.http.get<any>(this.analysisResultUrl + this.analysisID)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The analysis could not been performed: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar']
        });
        clearInterval(this.timer);
        return throwError(err);    //Rethrow it back to component
      }))
      .subscribe((result: AnalysisResult) => {
        this.resultURL = result.reactome_links[0].url;
        if (this.createReports) {
          this.timer = setInterval(() => this.getReportLoadingStatus(), 1000);
        }
      })
  }

  addDataset() {
    this.datasets.push({saved: false});
  }

  private getAnalysisLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.analysisStatusUrl + this.analysisID)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The analysis could not be performed: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar']
        });
        clearInterval(this.timer);
        return throwError(err);    //Rethrow it back to component
      }))
      .subscribe((status) => {
        this.analysisLoadingStatus = status;
        switch (status.status) {
          case 'complete':
            clearInterval(this.timer);
            this.processAnalysisResult();
            break;
          case 'failed':
            clearInterval(this.timer);
            break;
        }
      })
  }

  private getReportLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.reportStatusUrl + this.analysisID)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The reports could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar']
        });
        clearInterval(this.timer);
        return throwError(err);    //Rethrow it back to component
      }))
      .subscribe((status) => {
        this.reportLoadingStatus = status;
        switch (status.status) {
          case 'complete':
          case 'failed':
            clearInterval(this.timer);
            break;
        }
      })
  }
}
