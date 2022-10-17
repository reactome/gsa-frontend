export interface LoadingStatus {
  completed: number
  dataset_id : string
  description: string
  id : string
  status : string
}


export interface SampleMetadata {
  name: string;
  values: string[];
}

export interface DefaultParameter {
  name: string;
  value: string;
}

export interface DataSummary {
  id: string;
  title: string;
  type: string;
  description: string;
  group: string;
  sample_ids: string[];
  sample_metadata: SampleMetadata[];
  default_parameters: DefaultParameter[];
}


