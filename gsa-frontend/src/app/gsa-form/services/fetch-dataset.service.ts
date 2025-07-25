import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatasetSource} from "../state/dataset-source/dataset-source.state";
import {extractErrorMessage} from "../utilities/utils";
import {SearchResult} from "../state/search-result/search-result.state";

@Injectable({
  providedIn: 'root'
})
export class FetchDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/examples`;
  localDataUrl = `${environment.ApiRoot}/types`;
  inputDataUrl = `${environment.ApiRoot}/data/sources`;
  searchDataUrl = `${environment.ApiRoot}/data/search`;
  speciesDataUrl = `${environment.ApiRoot}/data/search/species`;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  fetchExampleDataSources(): Observable<DatasetSource[]> {
    return this.http.get<DatasetSource[]>(this.exampleDataUrl)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The dataset options could not been loaded: \n"  + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }));
  }

  fetchExternalDataSources(): Observable<DatasetSource[]> {
    return this.http.get<DatasetSource[]>(this.inputDataUrl)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The dataset options could not been loaded: \n"  + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }));
  }

  fetchLocalDataSources(): Observable<DatasetSource[]> {
    return this.http.get<DatasetSource[]>(this.localDataUrl)
      .pipe(catchError((err: HttpErrorResponse) => {
        this.snackBar.open("The dataset options could not been loaded: \n"  + extractErrorMessage(err), "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      }));
  }

  search(keywords: string, species: string | undefined | null): Observable<SearchResult[]> {
    const params: any = {
      keywords
    };
    if (species) params['species'] = species;
    return this.http.get<SearchResult[]>(this.searchDataUrl, {params}).pipe(catchError((err: Error) => {
        this.snackBar.open("The search could not be performed: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      })
    )
  }

  fetchSpeciesDataSources(): Observable<string[]> {
    return this.http.get<string[]>(this.speciesDataUrl).pipe(catchError((err: Error) => {
        this.snackBar.open("The search species could not be loaded: \n" + err.message, "Close", {
          panelClass: ['warning-snackbar'],
          duration: 10000
        });
        return throwError(() => err);    //Rethrow it back to component
      })
    )
  }
}
