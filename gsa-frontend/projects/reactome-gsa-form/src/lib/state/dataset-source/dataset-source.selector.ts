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
    selectBySource: (source: Source, method: Method) => createSelector(selectEntities, selectIds, (entities, ids) => {
      return ids?.map(id => entities[id])
        .filter(entity => entity?.source === source)
        .filter(isDefined)
        .filter(entity => entity.types?.some(type => method.data_types.includes(type)) || method.data_types.includes(entity.id!)
        );
    }),
    selectDatasetSource: (id: string) => createSelector(selectEntities, entities => entities[id]),
    selectSelectedSource: createSelector(selectEntities, selectSelectedSourceId, (entities, selectedSourceId) => selectedSourceId != null ? entities[selectedSourceId] : null),
    selectIsSelected: (source: PDatasetSource) => createSelector(selectSelectedSourceId, (id) => source.id === id),
  })
})
