import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {StatisticalDesign} from "../../model/dataset.model";
import {DataSummary, PLoadingStatus} from "../../model/load-dataset.model";
import {PartialRequired} from "../../model/utils.model";

export interface Dataset {
  id: number,
  saved: boolean,
  loadingStatus: PLoadingStatus,
  summary: DataSummary,
  annotations: string[][],
  statisticalDesign: StatisticalDesign
}

export type PDataset = PartialRequired<Dataset, 'id' | 'saved'>

export interface DatasetState extends EntityState<PDataset> {
  lastId: number;
}

export const datasetAdapter = createEntityAdapter<PDataset>();

export const initialState: DatasetState = datasetAdapter.getInitialState({
  lastId: 0
});





