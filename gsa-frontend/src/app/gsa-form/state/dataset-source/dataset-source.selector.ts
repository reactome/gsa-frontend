import {createFeature, createSelector} from "@ngrx/store";
import {datasetSourceReducer} from "./dataset-source.reducer";
import {datasetSourceAdapter, PDatasetSource, Source} from "./dataset-source.state";
import {isDefined} from "../../utilities/utils";

const selectors = datasetSourceAdapter.getSelectors();

export const datasetSourceFeature = createFeature({
    name: 'datasetSource',
    reducer: datasetSourceReducer,
    extraSelectors: ({selectDatasetSourceState, selectEntities, selectIds, selectSelectedSourceId}) => ({
        selectBySource: (source: Source) =>
            createSelector(selectEntities, selectIds, (entities, ids) =>
                ids?.map(id => entities[id])
                    .filter(entity => entity?.source === source)
                    .filter(isDefined)),
        selectDatasetSource: (id: string) => createSelector(selectEntities, entities => entities[id]),
        selectSelectedSource: createSelector(selectEntities, selectSelectedSourceId, (entities, selectedSourceId) => selectedSourceId != null ? entities[selectedSourceId] : null),
        selectIsSelected: (source: PDatasetSource) => createSelector(selectSelectedSourceId, (id) => source.id === id),
        selectAll: createSelector(selectDatasetSourceState, selectors.selectAll),
        selectTotal: createSelector(selectDatasetSourceState, selectors.selectTotal),
    })
})
