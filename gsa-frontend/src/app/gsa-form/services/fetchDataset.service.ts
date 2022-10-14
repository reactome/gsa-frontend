import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Method} from "../model/methods.model";
import {HttpClient} from "@angular/common/http";
import {Dataset, ExampleDataset, ImportDataset, LocalDataset, importParameter} from "../model/dataset.model";
import {map, Observable} from "rxjs";
import {Data} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FetchDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/examples`;
  localDataUrl = `${environment.ApiRoot}/types`;
  inputDataUrl = `${environment.ApiRoot}/data/sources`;
  selectedData: Dataset[] = [];
  chooseDataset: Dataset;


  constructor(private http: HttpClient) {
  }

  fetchExampleData(): Observable<ExampleDataset[]> {
    return this.http.get<ExampleDataset[]>(this.exampleDataUrl)
      .pipe(map((data: ExampleDataset[]) => {
        return data.map(value => new ExampleDataset(value.description, value.id, value.group, value.title, value.type));
      }));
  }

  fetchImportData(): Observable<ImportDataset[]> {
    return this.http.get<ImportDataset[]>(this.inputDataUrl)
      .pipe(map((data: ImportDataset[]) => {
        return data.map(value => new ImportDataset(value.parameters, value.name, value.description, value.id));
      }));
  }

  fetchLocalData(): Observable<LocalDataset[]> {
    return this.http.get<LocalDataset[]>(this.localDataUrl)
      .pipe(map((data: LocalDataset[]) => {
        return data.map(value => new LocalDataset(value.description, value.id, value.name));
      }));
  }


}
