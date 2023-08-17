import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PDatasetSource} from "../state/dataset-source/dataset-source.state";
import {Parameter} from "../state/parameter/parameter.state";

export interface DatasetSourceJSON extends PDatasetSource {
    parameters: Parameter[]
}

@Injectable({
  providedIn: 'root'
})
export class FetchDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/examples`;
  localDataUrl = `${environment.ApiRoot}/types`;
  inputDataUrl = `${environment.ApiRoot}/data/sources`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  fetchExampleDataSources(): Observable<DatasetSourceJSON[]> {
    return this.http.get<DatasetSourceJSON[]>(this.exampleDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }));
  }

  fetchExternalDataSources(): Observable<DatasetSourceJSON[]> {
    return this.http.get<DatasetSourceJSON[]>(this.inputDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }));
  }

  fetchLocalDataSources(): Observable<DatasetSourceJSON[]> {
    return this.http.get<DatasetSourceJSON[]>(this.localDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }));
  }
}
