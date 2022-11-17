import {Injectable} from '@angular/core';
import {AnalysisParameter, Comparison, DataInformation, Dataset, Parameter} from "../model/analysis.model";
import {LoadDatasetService} from "./load-dataset.service";
import {StatisticalDesignService} from "./statistical-design.service";
import {AnalysisMethodsService} from "./analysis-methods.service";
import {LoadingStatus} from "../model/load-dataset.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AnalysisObject} from "../model/analysisObject.model";
import {AnalysisResult} from "../model/analysis-result.model";
import {ReportStatus} from "../model/report-status.model";

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  submitAnalysisUrl = `${environment.ApiRoot}/analysis`;
  analysisStatusUrl = `${environment.ApiRoot}/status/`;
  analysisResultUrl = `${environment.ApiRoot}/result/`;
  visualizeAnalysisUrl = `${environment.ApiRoot}/status/`;
  reportStatusUrl = `${environment.ApiRoot}/report_status/`;
  datasetObjects : AnalysisObject[] = []
  analysisDatasets: Dataset[] = []
  methodName: string
  parameters: Parameter[] = []
  analysisParam: AnalysisParameter
  createReports: boolean = false
  analysisID?: string
  analysisLoadingStatus?: LoadingStatus;
  reportLoadingStatus?: LoadingStatus;
  private timer: NodeJS.Timer;
  analysisLoadingProgress: string = 'not started'
  reportLoadingProgress: string = 'not started'
  resultURL: string
  savedDatasets: number = 0;


  constructor(private analysisMethodService: AnalysisMethodsService, private loadDataService: LoadDatasetService, private statisticalDesignService: StatisticalDesignService, private http: HttpClient) {
  }


  private buildAnalysisDatasets() {
    for (let dataObject of this.datasetObjects) {
      let statisticalDesign: Comparison = {
        group1: dataObject.statisticalDesign!.comparisonGroup1,
        group2: dataObject.statisticalDesign!.comparisonGroup2
      }
      let dataInfo: DataInformation = {
        analysisGroup: this.loadDataService.getColumn(dataObject.statisticalDesign!.analysisGroup, dataObject),
        comparison: statisticalDesign,
        samples: dataObject.datasetTable!.rows
      }

      let dataset: Dataset = {
        data: dataObject.dataset!.id,
        design: dataInfo,
        name: dataObject.dataset!.title,
        type: dataObject.dataset!.type
      }
      this.analysisDatasets.push(dataset)
    }
  }


  loadAnalysis(): void {
    this.buildAnalysisDatasets();
    this.analysisLoadingProgress = 'loading'
    this.methodName = this.analysisMethodService.selectedMethod.name
    this.analysisMethodService.selectedMethod.parameters.forEach((param) => {
      let analysisParam: Parameter = {
        name: param.name,
        value: param.value
      }
      this.parameters.push(analysisParam)
    })
    this.analysisParam = {
      methodName: this.methodName,
      datasets: this.analysisDatasets,
      parameters: this.parameters
    }
    this.parameters.forEach((param) => {
      console.log(param)
      if (param.name === "create_reports" && param.value === true) {
        console.log("test")
        this.createReports = true
      }
    })

    this.setAnalysisID()
    this.timer = setInterval(() => this.getAnalysisLoadingStatus(), 1000)
  }

  private getAnalysisLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.analysisStatusUrl + this.analysisID)
      .subscribe((status) => {
        this.analysisLoadingStatus = status;
        if (this.analysisLoadingStatus?.status === 'complete') {
          clearInterval(this.timer);
          console.log(this.createReports)
          if (this.createReports) {
            this.reportLoadingProgress = 'loading'
            this.timer = setInterval(() => this.getReportLoadingStatus(), 1000)
          }
          this.processAnalysisResult()
          this.analysisLoadingProgress = 'completed'
        }
        if (this.analysisLoadingStatus?.status === 'failed') {
          clearInterval(this.timer);
          this.analysisLoadingProgress = 'failed'
        }
      })
  }

  setAnalysisID(): void {
    this.http.post(this.submitAnalysisUrl, this.analysisParam, {responseType: 'text'}).subscribe(
      response => this.analysisID = response)
  }


  processAnalysisResult(): void {
    this.http.get<any>(this.analysisResultUrl + this.analysisID)
      .subscribe((result: AnalysisResult) => {
        this.resultURL = result.reactome_links[0].url
      })
  }

  addDataset() {
    this.datasetObjects.push({})
  }

  private getReportLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.reportStatusUrl + this.analysisID)
      .subscribe((status) => {
        console.log(status)
        this.reportLoadingStatus = status;
        if (this.reportLoadingStatus?.status === 'complete') {
          clearInterval(this.timer);
          console.log(this.reportLoadingStatus?.reports)
          this.reportLoadingProgress = 'completed'
        }
        if (this.analysisLoadingStatus?.status === 'failed') {
          clearInterval(this.timer);
          this.reportLoadingProgress = 'failed'
        }
      })
  }

}
