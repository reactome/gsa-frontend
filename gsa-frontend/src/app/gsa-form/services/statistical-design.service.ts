import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticalDesignService {


  constructor() {
  }
}

export enum StatisticalField {
  analysisGroup,
  comparisonGroup1,
  comparisonGroup2,
  covariances
}
