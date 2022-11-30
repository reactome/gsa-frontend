import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Dataset, ExampleDataset, ImportDataset, LocalDataset} from "../model/fetch-dataset.model";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchDatasetService {
  exampleDataUrl = `${environment.ApiRoot}/data/examples`;
  localDataUrl = `${environment.ApiRoot}/types`;
  inputDataUrl = `${environment.ApiRoot}/data/sources`;
  chosenDataset: Dataset;


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
