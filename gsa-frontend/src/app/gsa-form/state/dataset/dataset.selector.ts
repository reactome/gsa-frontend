import {datasetAdapter} from "./dataset.state";
import {createFeature, createSelector} from "@ngrx/store";
import {datasetReducer} from "./dataset.reducer";


export const datasetFeature = createFeature({
    name: "dataset",
    reducer: datasetReducer,
    extraSelectors: ({selectDatasetState, selectEntities, selectIds}) => ({
        selectDataset: (id: string) => createSelector(selectEntities, entities => entities[id]),
        ...datasetAdapter.getSelectors(selectDatasetState)
    })
})
