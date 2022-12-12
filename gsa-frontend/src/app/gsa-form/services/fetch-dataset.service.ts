import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../model/fetch-dataset.model";
import {catchError, map, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class FetchDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/examples`;
  localDataUrl = `${environment.ApiRoot}/types`;
  inputDataUrl = `${environment.ApiRoot}/data/sources`;
  chosenDataset: Dataset;


  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  fetchExampleData(): Observable<ExampleDataset[]> {
    return this.http.get<ExampleDataset[]>(this.exampleDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }))
      .pipe(map((data: ExampleDataset[]) => {
        return data.map(value => new ExampleDataset(value.description, value.id, value.group, value.title, value.type));
      }));
  }

  fetchImportData(): Observable<ImportDataset[]> {
    return this.http.get<ImportDataset[]>(this.inputDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }))
      .pipe(map((data: ImportDataset[]) => {
        return data.map(value => new ImportDataset(value.parameters, value.name, value.description, value.id));
      }));
  }

  fetchLocalData(): Observable<LocalDataset[]> {
    return this.http.get<LocalDataset[]>(this.localDataUrl)
      .pipe(catchError((err: Error) => {
        this.snackBar.open("The dataset options could not been loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(err);    //Rethrow it back to component
      }))
      .pipe(map((data: LocalDataset[]) => {
        return data.map(value => new LocalDataset(value.description, value.id, value.name));
      }));
  }


}
