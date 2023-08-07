import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {PartialRequired} from "../../model/utils.model";

export type Source = 'External' | 'Local' | 'Example';

export interface DatasetSource {
  description: string;
  id: string;
  name: string;
  group: string;
  title: string;
  type: string;
  parameterIds: string[];
  source: Source;
}

export type PDatasetSource = PartialRequired<DatasetSource, 'description' | 'name' | 'id' | 'source'>;


export interface DatasetSourceState extends EntityState<PDatasetSource> {
  selectedSourceId: string | null
}

export const datasetSourceAdapter = createEntityAdapter<PDatasetSource>();

export const initialState: DatasetSourceState = datasetSourceAdapter.getInitialState({
  selectedSourceId: null
});

