import {Report} from "./report-status.model";
import {PartialRequired} from "./utils.model";
import {Parameter} from "./parameter.model";

export interface LoadingStatus {
  completed: number
  dataset_id: string
  description: string
  id: string
  reports: Report[]
  status: 'failed' | 'complete' | 'running' | 'pending';
}

export type PLoadingStatus = PartialRequired<LoadingStatus, 'id' | 'status'>

export interface LoadParameter {
  name: string
  value: any
}

export class LoadParameterClass implements LoadParameter {
  name: string
  value: any

  constructor(name: string, value: any) {
    this.name = name
    this.value = value
  }
}

export interface SampleMetadata {
  name: string;
  values: string[];
}

// export interface Parameter {
//   name: string;
//   value: string;
// }

export class DataSummary {
  id: string;
  title: string;
  type: string;
  description?: string;
  group?: string;
  sample_ids: string[];
  sample_metadata?: SampleMetadata[];
  default_parameters?: Parameter[];
  parameters?: Parameter[];
  complete?: boolean = false;
}

export function isComplete(loadingStatus: PLoadingStatus): loadingStatus is LoadingStatus {
  return (loadingStatus as LoadingStatus).dataset_id !== undefined
}


