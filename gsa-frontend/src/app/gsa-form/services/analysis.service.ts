import {Injectable} from '@angular/core';
import {AnalysisParameter, Comparison, DataInformation, Dataset, Parameter} from "../model/analysis.model";
import {LoadDatasetService} from "./load-dataset.service";
import {StatisticalDesignService} from "./statistical-design.service";
import {AnalysisMethodsService} from "./analysis-methods.service";
import {LoadingStatus} from "../model/load-dataset.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  // datasets: Dataset[] = [
  //   {
  //     "data": "EXAMPLE_MEL_PROT",
  //     "design": {
  //       "analysisGroup": [
  //         "P3",
  //         "P3",
  //         "P4",
  //         "P4",
  //         "P1",
  //         "P1",
  //         "P2",
  //         "P2",
  //         "all",
  //         "all",
  //         "P3",
  //         "P3",
  //         "P4",
  //         "P4",
  //         "P1",
  //         "P1",
  //         "P2",
  //         "P2",
  //         "all",
  //         "all"
  //       ],
  //       "cell.type": [
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "PBMCB",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC",
  //         "TIBC"
  //       ],
  //       "comparison": {
  //         "group1": "P4",
  //         "group2": "P1"
  //       },
  //       "condition": [
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM",
  //         "MOCK",
  //         "MCM"
  //       ],
  //       "samples": [
  //         "M.D.MOCK.PBMCB",
  //         "M.D.MCM.PBMCB",
  //         "M.K.MOCK.PBMCB",
  //         "M.K.MCM.PBMCB",
  //         "P.A.MOCK.PBMCB",
  //         "P.A.MCM.PBMCB",
  //         "P.W.MOCK.PBMCB",
  //         "P.W.MCM.PBMCB",
  //         "all.MOCK.PBMCB",
  //         "all.MCM.PBMCB",
  //         "M.D.MOCK.TIBC",
  //         "M.D.MCM.TIBC",
  //         "M.K.MOCK.TIBC",
  //         "M.K.MCM.TIBC",
  //         "P.A.MOCK.TIBC",
  //         "P.A.MCM.TIBC",
  //         "P.W.MOCK.TIBC",
  //         "P.W.MCM.TIBC",
  //         "all.MOCK.TIBC",
  //         "all.MCM.TIBC"
  //       ]
  //     },
  //     "name": "Melanoma proteomics example",
  //     "type": "proteomics_int"
  //   }
  // ]
  // methodName: string = "PADOG"
  // parameters: Parameter[] = [
  //   {
  //     "name": "use_interactors",
  //     "value": "false"
  //   },
  //   {
  //     "name": "include_disease_pathways",
  //     "value": "true"
  //   },
  //   {
  //     "name": "max_missing_values",
  //     "value": "0.5"
  //   },
  //   {
  //     "name": "sample_groups",
  //     "value": ""
  //   },
  //   {
  //     "name": "discrete_norm_function",
  //     "value": "TMM"
  //   },
  //   {
  //     "name": "continuous_norm_function",
  //     "value": "none"
  //   },
  //   {
  //     "name": "create_reactome_visualization",
  //     "value": "true"
  //   },
  //   {
  //     "name": "create_reports",
  //     "value": "true"
  //   },
  //   {
  //     "name": "email",
  //     "value": ""
  //   },
  //   {
  //     "name": "reactome_server",
  //     "value": "production"
  //   }
  // ]
  // analysisGroup: string = "cell.group"
  datasets: Dataset[] = []
  methodName: string
  parameters: Parameter[] = []
  analysisGroup: string
  analysisParam: AnalysisParameter
  createReports: boolean = false


  submitAnalysisUrl = `${environment.ApiRoot}/analysis`;
  analysisStatusUrl = `${environment.ApiRoot}/status/`;
  analysisResultUrl = `${environment.ApiRoot}/result/`;
  visualizeAnalysisUrl = `${environment.ApiRoot}/status/`;
  reportStatusUrl = `${environment.ApiSecretRoot}/report_status/`;
  analysisID?: string
  loadingStatus?: LoadingStatus;
  private timer: NodeJS.Timer;
  loadingProgress: string = 'not started'


  constructor(private analysisMethodService: AnalysisMethodsService, private loadDataService: LoadDatasetService, private statisticalDesignService: StatisticalDesignService, private http: HttpClient) {
  }

  saveDataset() {
    this.analysisGroup = this.statisticalDesignService.analysisGroup[this.loadDataService.currentDataset]
    let statisticalDesign: Comparison = {
      group1: this.statisticalDesignService.comparisonGroup1[this.loadDataService.currentDataset],
      group2: this.statisticalDesignService.comparisonGroup2[this.loadDataService.currentDataset]
    }
    let dataInfo: DataInformation = {
      analysisGroup: this.loadDataService.getColumn(this.statisticalDesignService.analysisGroup[this.loadDataService.currentDataset]),
      comparison: statisticalDesign,
      samples: this.loadDataService.rows[this.loadDataService.currentDataset]
    }

    let dataset: Dataset = {
      data: this.loadDataService.dataSummary[this.loadDataService.currentDataset].id,
      design: dataInfo,
      name: this.loadDataService.dataSummary[this.loadDataService.currentDataset].title,
      type: this.loadDataService.dataSummary[this.loadDataService.currentDataset].type
    }

    this.datasets.push(dataset)
    // this.loadDataService.currentDataset += 1
  }

  changeDataset(changedData: number) {
    this.analysisGroup = this.statisticalDesignService.analysisGroup[changedData]
    let statisticalDesign: Comparison = {
      group1: this.statisticalDesignService.comparisonGroup1[changedData],
      group2: this.statisticalDesignService.comparisonGroup2[changedData]
    }
    let dataInfo: DataInformation = {
      analysisGroup: this.loadDataService.getColumn(this.statisticalDesignService.analysisGroup[changedData]),
      comparison: statisticalDesign,
      samples: this.loadDataService.rows[changedData]
    }

    let dataset: Dataset = {
      data: this.loadDataService.dataSummary[changedData].id,
      design: dataInfo,
      name: this.loadDataService.dataSummary[changedData].title,
      type: this.loadDataService.dataSummary[changedData].type
    }

    this.datasets[changedData] = dataset
  }


  loadAnalysis(): void {
    this.loadingProgress = 'loading'
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
      datasets: this.datasets,
      parameters: this.parameters
    }
    this.parameters.forEach((param) => {
      if (param.name === "create_reports" && param.value === "true") {
        this.createReports = true
      }
    })

    this.setAnalysisID()
    this.timer = setInterval(() => this.getAnalysisLoadingStatus(), 1000)
  }

  private getAnalysisLoadingStatus(): void {
    this.http.get<LoadingStatus>(this.analysisStatusUrl + this.analysisID)
      .subscribe((status) => {
        this.loadingStatus = status;
        if (this.loadingStatus?.status === 'complete') {
          clearInterval(this.timer);
          if (this.createReports) {
            // this.processReport()
          }
          this.processAnalysisResult()
          this.loadingProgress = 'completed'
        }
        if (this.loadingStatus?.status === 'failed') {
          clearInterval(this.timer);
          this.loadingProgress = 'failed'
        }
      })
  }

  setAnalysisID(): void {
    this.http.post(this.submitAnalysisUrl, this.analysisParam, {responseType: 'text'}).subscribe(
      response => this.analysisID = response)
  }


  processAnalysisResult(): void {
    this.http.get<any>(this.analysisResultUrl + this.analysisID)
      .subscribe((result) => {
        // this.visualizeAnalysis()
      })
  }



}
