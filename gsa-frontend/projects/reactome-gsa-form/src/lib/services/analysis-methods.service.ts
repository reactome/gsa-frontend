import {Inject, Injectable} from '@angular/core';
import {Method} from "../model/methods.model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {extractErrorMessage} from "../utilities/utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GsaConfig, REACTOME_GSA_CONFIG} from "../config/gsa-config";


export const typeToParse: { [p: string]: (value: string) => any } = {
  bool: value => value.toLowerCase() === 'true',
  float: parseFloat,
  int: parseInt,
  email: value => value,
  string: value => value
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisMethodsService {
  methodsUrl = `${this.config.apiRoot}/methods`;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(REACTOME_GSA_CONFIG) private config: GsaConfig
  ) {
  }

  getAll(): Observable<Method[]> {
    return this.http.get<Method[]>(this.methodsUrl)
      .pipe(catchError((err: HttpErrorResponse) => {
          this.snackBar.open("The methods couldn't be loaded: \n" + extractErrorMessage(err), "Close", {
            panelClass: ['warning-snackbar']
          })
          return throwError(() => err);    //Rethrow it back to component
        })
      )
  }
}
