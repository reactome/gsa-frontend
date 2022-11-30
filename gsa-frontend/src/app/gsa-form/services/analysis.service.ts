import {Injectable} from '@angular/core';
import {LoadDatasetService} from "./load-dataset.service";
import {AnalysisMethodsService} from "./analysis-methods.service";
import {LoadingStatus} from "../model/load-dataset.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {currentDataset} from "../model/analysisObject.model";
import {AnalysisResult} from "../model/analysis-result.model";
import {Request} from "../model/analysis.model";

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  submitAnalysisUrl = `${environment.ApiRoot}/analysis`;
  analysisStatusUrl = `${environment.ApiRoot}/status/`;
  analysisResultUrl = `${environment.ApiRoot}/result/`;
  reportStatusUrl = `${environment.ApiRoot}/report_status/`;
  analysisDatum: currentDataset[] = [];
  createReports: boolean = false;
  analysisID?: string;
  analysisLoadingStatus?: LoadingStatus;
  reportLoadingStatus?: LoadingStatus;
  resultURL: string;
  private timer: NodeJS.Timer;

  constructor(private analysisMethodService: AnalysisMethodsService, private loadDataService: LoadDatasetService, private http: HttpClient) {
  }

  anyDatasetComplete(): boolean {
    return this.analysisDatum.some(value => value.saved);
  }

  loadAnalysis(): void {
    this.submitQuery();
    this.timer = setInterval(() => this.checkStatus(), 1000);
  }

  submitQuery(): void {
    const query: Request.Query = {
      methodName: this.analysisMethodService.selectedMethod?.name || "Method name",
      parameters: this.analysisMethodService.selectedMethod?.parameters.map(param => ({
        name: param.name,
        value: param.value
      })) || [],
      datasets: this.analysisDatum.map(dataset => ({
        data: dataset.summary!.id,
        name: dataset.summary!.title,
        type: dataset.summary!.type,
        parameters: [],
        design: {
          analysisGroup: dataset.table!.column(dataset.statisticalDesign!.analysisGroup as string),
          samples: dataset.table!.rows,
          comparison: {
            group1: dataset.statisticalDesign!.comparisonGroup1 as string,
            group2: dataset.statisticalDesign!.comparisonGroup2 as string,
          },
        }
      })),
    };
    this.createReports = query.parameters.some(param => param.name === 'create_reports' && param.value);
    this.http.post(this.submitAnalysisUrl, query, {responseType: 'text'})
      .subscribe(response => this.analysisID = response);
  }

  processAnalysisResult(): void {
    this.http.get<any>(this.analysisResultUrl + this.analysisID)
      .subscribe((result: AnalysisResult) => {
        this.resultURL = result.reactome_links[0].url;
        if (this.createReports) {
          this.getReportLoadingStatus()
        }
      })
  }

  addDataset() {
    this.analysisDatum.push({saved: false});
  }

  private checkStatus(): void {
    this.http.get<LoadingStatus>(this.analysisStatusUrl + this.analysisID)
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
