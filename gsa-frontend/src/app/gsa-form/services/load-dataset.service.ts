import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataSummary, LoadingStatus, LoadParameter, PLoadingStatus} from "../model/load-dataset.model";
import {UploadData} from "../model/upload-dataset-model";
import {LoadingProgressComponent} from "../datasets/select-dataset/loading-progress/loading-progress.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {catchError, EMPTY, Observable, of, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dataset, PDataset} from "../state/dataset/dataset.state";


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

    // private _loadingStatus$: Subject<Partial<LoadingStatus>> = new BehaviorSubject<Partial<LoadingStatus>>({status: "running"});

    // private loadSubject: Subject<{
    //     resourceId: string,
    //     postParameters: LoadParameter[],
    //     dataset: Dataset
    // }> = new Subject();

    // dataset$: Observable<Dataset> = this.loadSubject.pipe(
    //     share(),
    //     tap(() => {
    //         console.log("Load subject triggered")
    //         this.showLoadingDialog()
    //     }),
    //     switchMap(({resourceId, postParameters, dataset}) =>
    //         this.submitLoadDataset(resourceId, postParameters).pipe(
    //             switchMap(loadingId => this.http.get<LoadingStatus>(this.loadingStatusUrl + loadingId).pipe(
    //                 catchError(err => this.snackError<Partial<LoadingStatus>>(err, of({
    //                     status: 'failed',
    //                     description: err.message
    //                 }))),
    //                 distinct(loading => loading.status),
    //                 tap(loading => this._loadingStatus$.next(loading)),
    //                 repeat({delay: 500}),
    //                 filter(loading => loading.status === 'complete' || loading.status === 'failed'),
    //                 take(1),
    //                 switchMap(loading => loading.status === 'failed' ?
    //                     EMPTY :
    //                     this.http.get<DataSummary>(this.summaryDataUrl + loading.dataset_id).pipe(
    //                         catchError(err => this.snackError(err, EMPTY)),
    //                         map(summary => this.computeTableValues({
    //                                 ...dataset,
    //                                 summary: {...summary, parameters: []},
    //                                 statisticalDesign: undefined,
    //                                 saved: false
    //                             })
    //                         ),
    //                     ))
    //             ))
    //         ))
    // );


    constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar) {
        // this.loadingStatus$.subscribe((status) => console.log("Status: ", status));
        // this.loadingStatus$.pipe(
        //     filter(status => status.status === 'complete' || status.status === 'failed'),
        //     delay(1000)
        // ).subscribe(() => {
        //     console.log("result", this.dialogRef)
        //     this.dialogRef.close()
        // })
    }


    snackError<T>(err: Error, failValue$: Observable<T>): Observable<T> {
        this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
            panelClass: ['warning-snackbar'],
            duration: 10000
        });
        return failValue$;
    }

    // get loadingStatus$(): Observable<Partial<LoadingStatus>> {
    //     return this._loadingStatus$;
    // }

    loadDataset(resourceId: string, postParameters: LoadParameter[], dataset: Dataset): void {
        // console.log("Load dataset")
        // this.loadSubject.next({resourceId, postParameters, dataset});
    }

    // showLoadingDialog() {
    //     this._loadingStatus$.next({status: 'running'});
    //     this.dialogRef = this.dialog.open(LoadingProgressComponent, {
    //         width: '50%',
    //         height: '50%',
    //         disableClose: true,
    //     });
    // }

    submitLoadDataset(resourceId: string, postParameters: { name: string, value: any }[]): Observable<string> {
        return this.http.post(this.loadDataUrl + resourceId, postParameters, {responseType: 'text'})
            .pipe(catchError((err: Error) => {
                this.snackBar.open("The chosen dataset could not been loaded: \n" + err.message, "Close", {
                    panelClass: ['warning-snackbar'],
                    duration: 10000
                });
                return throwError(() => err);    //Rethrow it back to component
            }))
    }

    getLoadingStatus(loadingId: string): Observable<PLoadingStatus> {
        return this.http.get<LoadingStatus>(this.loadingStatusUrl + loadingId).pipe(
            catchError(err => this.snackError<PLoadingStatus>(err, of({id: loadingId, status: 'failed', description: err.message})))
        );
    }

    getSummary(datasetId: string): Observable<DataSummary> {
        return this.http.get<DataSummary>(this.summaryDataUrl + datasetId).pipe(
            catchError(err => this.snackError(err, EMPTY)));
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


    uploadFile(file: File): Observable<UploadData> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<UploadData>(this.uploadDataUrl, formData)
            .pipe(catchError((err: Error) => {
                this.snackBar.open("The chosen dataset could not been uploaded: \n" + err.message, "Close", {
                    panelClass: ['warning-snackbar'],
                    duration: 10000
                });
                return throwError(() => err);    //Rethrow it back to component
            }))
    }

    // getColumnValues(dataset: Dataset, colName: any): string[] {
    //     let colIndex = dataset.table!.columns.indexOf(colName);
    //     return dataset.table?.dataset.map(row => row[colIndex].value) || [];
    // }
    //
    // computeColumnValues(dataset: Dataset, colName: string | undefined, group: string): string[] {
    //     let colValues: string[] = this.getColumnValues(dataset, colName);
    //     colValues = colValues.filter((value, index) => colValues.indexOf(value) === index)
    //     colValues = colValues.filter(item => item !== "");
    //     const design = dataset.statisticalDesign!;
    //     switch (group) {
    //         case 'first':
    //             if (!colValues.includes(<string>design.comparisonGroup1)) design.comparisonGroup1 = undefined;
    //             break;
    //         case 'second':
    //             if (!colValues.includes(<string>design.comparisonGroup2)) design.comparisonGroup2 = undefined;
    //             colValues = colValues.filter(val => val !== design.comparisonGroup1);
    //             if (colValues.length === 1) design.comparisonGroup2 = colValues[0];
    //             break;
    //     }
    //     return colValues;
    // }
    //
    // computeValidColumns(dataset: Dataset): string[] {
    //     return dataset.table!.columns?.filter((colName) => this.computeColumnValues(dataset, colName, "default").length > 1);
    // }

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
