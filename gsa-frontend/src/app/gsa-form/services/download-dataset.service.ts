import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DownloadDatasetService {

  url(datasetId: string, format: 'expr' | 'meta' = 'expr'): string {
    return `${environment.ApiRoot}/data/download/${datasetId}?format=${format}`
  }

  constructor() {
  }
}
