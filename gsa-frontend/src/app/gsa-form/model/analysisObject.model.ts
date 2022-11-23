import {DataSummary} from "./load-dataset.model";
import {CellValue} from "handsontable/common";

export interface DatasetTable {
  columns : string[]
  rows : string []
  dataset : CellValue[][]
}

export interface StatisticalDesign {
  analysisGroup: string | undefined;
  comparisonGroup1: string | undefined;
  comparisonGroup2: string | undefined;
  covariances: string[];
}

export interface AnalysisObject {
  saved: boolean;
  dataset?: DataSummary;
  datasetTable?: DatasetTable;
  statisticalDesign?: StatisticalDesign;
}
