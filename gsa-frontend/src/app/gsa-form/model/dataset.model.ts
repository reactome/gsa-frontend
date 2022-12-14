import {DataSummary} from "./load-dataset.model";
import {CellInfo} from "./table.model";


export class DatasetTable {
  constructor(
    public columns: string[],
    public rows: string [],
    public dataset: CellInfo[][]
  ) {
  }

  column(columnName: string): any[] {
    let colIndex = this.columns.indexOf(columnName);
    return this.dataset.map(row => row[colIndex].value) || [];
  }
}

export interface StatisticalDesign {
  analysisGroup?: string;
  comparisonGroup1?: string;
  comparisonGroup2?: string;
  covariances: Covariate[];
  // covariances: string[];
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
