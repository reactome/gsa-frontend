export interface AnalysisParameter {
  methodName: string
  datasets: Dataset[]
  parameters: Parameter[]
}

export interface Dataset {
  data: string
  design: DataInformation
  name: string
  type: string
}

export interface DataInformation {
  analysisGroup: string[];
  comparison: Comparison;
  samples: string[];
  [covariant: string]: string[] | Comparison;
}

export interface Comparison {
  group1: string
  group2: string
}

export interface Parameter {
  name: string
  value: any
}
