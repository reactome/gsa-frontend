import {createFeature, createSelector} from "@ngrx/store";
import {datasetSourceReducer} from "./dataset-source.reducer";
import {datasetSourceAdapter, PDatasetSource, Source} from "./dataset-source.state";
import {isDefined} from "../../utilities/utils";
import {Method} from "../method/method.state";

export const datasetSourceFeature = createFeature({
  name: 'datasetSource',
  reducer: datasetSourceReducer,
  extraSelectors: ({selectDatasetSourceState, selectEntities, selectIds, selectSelectedSourceId}) => ({
    ...datasetSourceAdapter.getSelectors(selectDatasetSourceState),
    selectBySource: (source: Source, method: Method) => createSelector(selectEntities, selectIds, (datasetSources, ids) => {
      return ids?.map(id => datasetSources[id])
        .filter(datasetSource => datasetSource?.source === source)
        .filter(isDefined)
        .filter(datasetSource => !(datasetSource.source === 'External' && datasetSource.id === 'example_datasets'))// Remove example datasets as they are not displayed as external anyway, but in their specific column
        .filter(datasetSource => datasetSource.data_types?.some(type => method.data_types.includes(type)) || method.data_types.includes(datasetSource.type!) || method.data_types.includes(datasetSource.id!))
    }),
    selectDatasetSource: (id: string) => createSelector(selectEntities, entities => entities[id]),
    selectSelectedSource: createSelector(selectEntities, selectSelectedSourceId, (entities, selectedSourceId) => selectedSourceId != null ? entities[selectedSourceId] : null),
    selectIsSelected: (source: PDatasetSource) => createSelector(selectSelectedSourceId, (id) => source.id === id),
  })
})
