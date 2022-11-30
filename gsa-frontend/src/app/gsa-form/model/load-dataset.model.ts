import {Report} from "./report-status.model";

export interface LoadingStatus {
  completed: number
  dataset_id : string
  description: string
  id : string
  reports: Report[]
  status : string
}

export interface LoadParameter {
  name: string
  value: any
}

export class LoadParameterClass implements LoadParameter{
  name: string
  value: any

  constructor(name:string, value:any) {
    this.name = name
    this.value = value
  }
}

export interface SampleMetadata {
  name: string;
  values: string[];
}

export interface DefaultParameter {
  name: string;
  value: string;
}

export class DataSummary {
  id: string;
  title: string;
  type: string;
  description: string;
  group: string;
  sample_ids: string[];
  sample_metadata: SampleMetadata[];
  default_parameters: DefaultParameter[];
  complete: boolean = false;
}


