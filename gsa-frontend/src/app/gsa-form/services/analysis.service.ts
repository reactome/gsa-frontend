import {Injectable} from '@angular/core';
import {LoadingStatus} from "../model/load-dataset.model";
import {environment} from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {AnalysisResult} from "../model/analysis-result.model";
import {Request} from "../model/analysis.model";
import {catchError, EMPTY, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Method} from "../state/method/method.state";
import {Dataset} from "../state/dataset/dataset.state";
import {Parameter} from "../model/parameter.model";
import {extractErrorMessage} from "../utilities/utils";

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  submitAnalysisUrl = `${environment.ApiRoot}/analysis`;
  analysisStatusUrl = `${environment.ApiRoot}/status/`;
  analysisResultUrl = `${environment.ApiRoot}/result/`;
  reportStatusUrl = `${environment.ApiRoot}/report_status/`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  submitQuery(method: Method, parameters: Parameter[], datasets: Dataset[]): Observable<string> {
    const query: Request.Query = {
      methodName: method.name || "Method name",
      parameters: parameters.map(param => ({
        name: param.name,
        value: param.value
      })) || [],
      datasets: datasets.map((dataset: Dataset) => ({
        data: dataset.summary!.id,
        name: dataset.summary!.title,
        type: dataset.summary!.type,
        parameters: dataset.summary!.parameters?.filter(para => para.scope !== "common").map(param => ({
          name: param.name,
          value: param.value
        })),
        design: {
          analysisGroup: dataset.annotationColumns.get(dataset.statisticalDesign.analysisGroup!)!,
          samples: dataset.annotationColumns.get('sample_ids')!,
          comparison: {
            group1: dataset.statisticalDesign!.comparisonGroup1 as string,
            group2: dataset.statisticalDesign!.comparisonGroup2 as string,
          },
          ...dataset.statisticalDesign!.covariances.filter(cov => cov.value).reduce((covs, cov) => ({
            ...covs,
            [cov.name]: dataset.annotationColumns.get(cov.name!)!
          }), {})
        },
      })),
    };
    return this.http.post(this.submitAnalysisUrl, query, {responseType: 'text'})
  }

  cancelAnalysis(analysisId: string): Observable<never> {
    return EMPTY; // TODO Switch to actual API call when backend ready (https://github.com/reactome/gsa-backend/issues/47)
  }

  getAnalysisLoadingStatus(analysisId: string): Observable<LoadingStatus> {
    return this.http.get<LoadingStatus>(this.analysisStatusUrl + analysisId)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The analysis could not be performed: \n" + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar']
        });
        return throwError(() => err);    //Rethrow it back to component
      }))
  }

  getAnalysisResults(analysisId: string): Observable<AnalysisResult> {
    return this.http.get<AnalysisResult>(this.analysisResultUrl + analysisId)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The analysis could not been performed: \n" + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar']
        });
        return throwError(() => err);    //Rethrow it back to component
      }))
  }

  getReportLoadingStatus(analysisId: string): Observable<LoadingStatus> {
    return this.http.get<LoadingStatus>(this.reportStatusUrl + analysisId)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The reports could not been loaded: \n" + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar']
        });
        return throwError(() => err);    //Rethrow it back to component
      }))
  }
}
