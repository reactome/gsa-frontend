import {DataSummary} from "./load-dataset.model";
import {CellInfo} from "reactome-table";


export class DatasetTable {
  constructor(
    public columns: string[],
    public rows: string [],
    public dataset: CellInfo[][]
  ) {
  }
}

export interface StatisticalDesign {
  defaultComparisonFactor?: string;
  defaultGroup1?: string;
  defaultGroup2?: string;
  defaultCovariances: Set<string>;

  analysisGroup?: string;
  comparisonGroup1?: string;
  comparisonGroup2?: string;
  covariances: Covariate[];
}

export interface Covariate {
  name: string;
  value: boolean;
}

export interface Dataset {
  saved: boolean;
  summary?: DataSummary;
  table?: DatasetTable;
  statisticalDesign?: StatisticalDesign;
}
