import {Inject, Injectable} from '@angular/core';
import {GsaConfig, REACTOME_GSA_CONFIG} from "../config/gsa-config";


@Injectable({
  providedIn: 'root'
})
export class DownloadDatasetService {

  url(datasetId: string, format: 'expr' | 'meta' = 'expr'): string {
    return `${this.config.apiRoot}/data/download/${datasetId}?format=${format}`
  }

  constructor(@Inject(REACTOME_GSA_CONFIG) private config: GsaConfig) {
  }
}
