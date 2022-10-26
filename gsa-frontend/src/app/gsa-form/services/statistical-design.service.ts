import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticalDesignService {
  analysisGroup: string;
  comparisonGroup1: string;
  comparisonGroup2: string;
  covariances: string[];
  fields: Map<StatisticalField, string | string[]> = new Map();

  constructor() {
  }
}

export enum StatisticalField {
  analysisGroup,
  comparisonGroup1,
  comparisonGroup2,
  covariances
}
