import {DataSummary} from "./load-dataset.model";
import {CellValue} from "handsontable/common";

export interface DatasetTable {
  columns : string[]
  rows : string []
  dataset : CellValue[][]
}

export interface StatisticalDesign {
  analysisGroup: string;
  comparisonGroup1: string;
  comparisonGroup2: string;
  covariances: string[];
}

export interface AnalysisObject {
  dataset?: DataSummary;
  datasetTable?: DatasetTable;
  statisticalDesign?: StatisticalDesign;
}
