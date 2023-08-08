import {datasetAdapter} from "./dataset.state";
import {createFeature, createSelector} from "@ngrx/store";
import {datasetReducer} from "./dataset.reducer";
import {transpose} from "../../utilities/table/state/table.util";


export const datasetFeature = createFeature({
  name: "dataset",
  reducer: datasetReducer,
  extraSelectors: ({selectDatasetState, selectEntities,selectLastId}) => ({
    ...datasetAdapter.getSelectors(selectDatasetState),
    selectLastDataset: createSelector(selectEntities, selectLastId, (entities, lastId) => entities[lastId]),
    selectDataset: (id: number) => createSelector(selectEntities, entities => entities[id]),
    selectIsSaved: (id: number) => createSelector(selectEntities, entities => !!(entities[id] && entities[id]!.saved)),
    selectLoadingComplete: (id: number) => createSelector(selectEntities, entities => !!(entities[id] && entities[id]!.loadingStatus!.status === "complete")),
    selectSummaryComplete: (id: number) => createSelector(selectEntities, entities => !!(entities[id] && entities[id]!.summary)),
    selectAnnotationComplete: (id: number) => createSelector(selectEntities, entities => !!(entities[id] && entities[id]!.annotations &&
      transpose(entities[id]!.annotations as string[][]) // column by column
        .slice(1) // exclude row headers
        .map(col => col.slice(1)) // exclude column headers
        .filter((col) => col
          .filter((value, i) => col.indexOf(value) === i) // distinct values
          .length > 1) // only columns with more than 1 distinct value
        .length > 0)), // at least 1 column with more than 1 distinct value
    selectStatisticalDesignComplete: (id: number) => createSelector(selectEntities, entities => !!(entities[id] && entities[id]!.statisticalDesign &&
      entities[id]!.statisticalDesign!.analysisGroup &&
      entities[id]!.statisticalDesign!.comparisonGroup1 &&
      entities[id]!.statisticalDesign!.comparisonGroup2 &&
      entities[id]!.statisticalDesign!.comparisonGroup1 !== entities[id]!.statisticalDesign!.comparisonGroup2)
    ),
  })
})
