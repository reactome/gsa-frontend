import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {StatisticalDesign} from "../../model/dataset.model";
import {DataSummary, PLoadingStatus} from "../../model/load-dataset.model";
import {PartialRequired} from "../../model/utils.model";

export interface Dataset {
    id: string,
    saved: boolean,
    loadingStatus: PLoadingStatus,
    summary: DataSummary,
    annotations: string[][],
    statisticalDesign: StatisticalDesign
}

export type PDataset = PartialRequired<Dataset, 'id'>

export interface DatasetState extends EntityState<PDataset> {
}

export const datasetAdapter = createEntityAdapter<PDataset>();

export const initialState: DatasetState = datasetAdapter.getInitialState({
});





