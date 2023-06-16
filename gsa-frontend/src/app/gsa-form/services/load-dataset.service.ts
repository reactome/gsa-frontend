import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataSummary, LoadingStatus, LoadParameter} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";

import {Dataset, DatasetTable} from "../model/dataset.model";
import {CellInfo} from "../model/table.model";
import {LoadingProgressComponent} from "../datasets/select-dataset/loading-progress/loading-progress.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  BehaviorSubject,
  catchError, debounce, debounceTime,
  delay, distinct,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  repeat, share,
  Subject,
  switchMap,
  take,
  tap, throttleTime,
  throwError
} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class LoadDatasetService {
  // stepper: MatStepper;
  loadDataUrl = `${environment.ApiRoot}/data/load/`;
  loadingStatusUrl = `${environment.ApiRoot}/data/status/`;
  summaryDataUrl = `${environment.ApiRoot}/data/summary/`;
  uploadDataUrl = `${environment.ApiSecretRoot}/upload`;
  dialogRef: MatDialogRef<LoadingProgressComponent>;

  private _loadingStatus$: Subject<Partial<LoadingStatus>> = new BehaviorSubject<Partial<LoadingStatus>>({status: "running"});

  private loadSubject: Subject<{
    resourceId: string,
    postParameters: LoadParameter[],
    dataset: Dataset
  }> = new Subject();

  dataset$: Observable<Dataset> = this.loadSubject.pipe(
    share(),
    tap(() => {
      console.log("Load subject triggered")
      this.showLoadingDialog()
    }),
    switchMap(({resourceId, postParameters, dataset}) =>
      this.submitQuery(resourceId, postParameters).pipe(
        switchMap(loadingId => this.http.get<LoadingStatus>(this.loadingStatusUrl + loadingId).pipe(
          catchError(err => this.snackError<Partial<LoadingStatus>>(err, of({
            status: 'failed',
            description: err.message
          }))),
          distinct(loading => loading.status),
          tap(loading => this._loadingStatus$.next(loading)),
          repeat({delay: 500}),
          filter(loading => loading.status === 'complete' || loading.status === 'failed'),
          take(1),
          switchMap(loading => loading.status === 'failed' ?
            EMPTY :
            this.http.get<DataSummary>(this.summaryDataUrl + loading.dataset_id).pipe(
              catchError(err => this.snackError(err, EMPTY)),
              map(summary => this.computeTableValues({
                  ...dataset,
                  summary: {...summary, parameters: []},
                  statisticalDesign: undefined,
                  saved: false
                })
              ),
            ))
        ))
      ))
  );


  constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.loadingStatus$.subscribe((status) => console.log("Status: ", status));
    this.loadingStatus$.pipe(
      filter(status => status.status === 'complete' || status.status === 'failed'),
      delay(1000)
    ).subscribe(() => {
      console.log("result", this.dialogRef)
      this.dialogRef.close()
    })
  }


  snackError<T>(err: Error, failValue$: Observable<T>): Observable<T> {
    this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
      panelClass: ['warning-snackbar'],
      duration: 10000
    });
    return failValue$;
  }

  get loadingStatus$(): Observable<Partial<LoadingStatus>> {
    return this._loadingStatus$;
  }

  loadDataset(resourceId: string, postParameters: LoadParameter[], dataset: Dataset): void {
    console.log("Load dataset")
    this.loadSubject.next({resourceId, postParameters, dataset});
  }

  showLoadingDialog() {
    this._loadingStatus$.next({status: 'running'});
    this.dialogRef = this.dialog.open(LoadingProgressComponent, {
      width: '50%',
      height: '50%',
      disableClose: true,
    });
  }

  submitQuery(resourceId: string, postParameters: any): Observable<string> {
    return this.http.post(this.loadDataUrl + resourceId, postParameters, {responseType: 'text'})
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }))
  }

  // processDataSummary(dataset: Dataset): void {
  //   this.http.get<DataSummary>(this.summaryDataUrl + this.loadingStatus?.dataset_id)
  //     .pipe(catchError((err: Error) => {
  //       this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
  //         panelClass: ['warning-snackbar'],
  //         duration: 10000
  //       });
  //       return throwError(err);    //Rethrow it back to component
  //     }))
  //     .subscribe((summary) => {
  //       dataset.summary = summary;
  //       dataset.summary.parameters = []
  //       dataset.statisticalDesign = undefined
  //       dataset.saved = false
  //       this.computeTableValues(dataset);
  //     })
  // }

  computeTableValues(newData: Dataset): Dataset {
    let rows: string[] = newData.summary!.sample_ids!.map(id => id);
    let dataset: CellInfo[][] = newData.summary!.sample_metadata![0].values.map(() => []);
    let columns: string[] = newData.summary!.sample_metadata!.map(data => {
      data.values.forEach((value, i) =>
        dataset[i % rows.length].push(new CellInfo(value)));
      return data.name;
    })
    newData.table = new DatasetTable(columns, rows, dataset);
    return newData
  }

  uploadFile(file: File, newData: Dataset, type: string): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.http.post<UploadData>(this.uploadDataUrl, formData)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The chosen dataset could not been uploaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }))
      .subscribe(response => {

          let dataSummary: DataSummary = {
            id: response.data_token,
            title: file.name.substring(0, file.name.lastIndexOf(".")),
            type: type,
            default_parameters: [],
            parameters: []
          }
          newData.statisticalDesign = undefined
          newData.saved = false
          newData.summary = dataSummary


          let rows: string[] = response.sample_names;
          let columns: string[] = ["Annotation1"];
          let dataset: CellInfo[][] = rows.map(() => [new CellInfo()]);
          newData.table = new DatasetTable(columns, rows, dataset);

          setTimeout(() => {
            // this.stepper.next();
          }, 0);

        }
      )
  }

  getColumnValues(dataset: Dataset, colName: any): string[] {
    let colIndex = dataset.table!.columns.indexOf(colName);
    return dataset.table?.dataset.map(row => row[colIndex].value) || [];
  }

  computeColumnValues(dataset: Dataset, colName: string | undefined, group: string): string[] {
    let colValues: string[] = this.getColumnValues(dataset, colName);
    colValues = colValues.filter((value, index) => colValues.indexOf(value) === index)
    colValues = colValues.filter(item => item !== "");
    const design = dataset.statisticalDesign!;
    switch (group) {
      case 'first':
        if (!colValues.includes(<string>design.comparisonGroup1)) design.comparisonGroup1 = undefined;
        break;
      case 'second':
        if (!colValues.includes(<string>design.comparisonGroup2)) design.comparisonGroup2 = undefined;
        colValues = colValues.filter(val => val !== design.comparisonGroup1);
        if (colValues.length === 1) design.comparisonGroup2 = colValues[0];
        break;
    }
    return colValues;
  }

  computeValidColumns(dataset: Dataset): string[] {
    return dataset.table!.columns?.filter((colName) => this.computeColumnValues(dataset, colName, "default").length > 1);
  }

  // private waitForResult(dataset: Dataset): void {
  //   this.http.get<LoadingStatus>(this.loadingStatusUrl + this.loadingID)
  //     .pipe(catchError((err: Error) => {
  //       this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
  //         panelClass: ['warning-snackbar'],
  //         duration: 10000
  //       });
  //       return throwError(err);    //Rethrow it back to component
  //     }))
  //     .subscribe((status) => {
  //       this.loadingStatus = status;
  //       switch (this.loadingStatus?.status) {
  //         case 'failed':
  //           clearInterval(this.timer);
  //           break;
  //         case "complete":
  //           clearInterval(this.timer);
  //           this.processDataSummary(dataset);
  //           break;
  //       }
  //     })
  // }
}
