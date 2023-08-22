import {datasetAdapter} from './dataset.state';
import {createFeature, createSelector} from '@ngrx/store';
import {datasetReducer} from './dataset.reducer';
import {transpose} from '../../utilities/table/state/table.util';
import {Covariate} from "../../model/dataset.model";
import {MethodParameter} from "../../model/methods.model";
import {Parameter} from "../parameter/parameter.state";

export type AnalysisGroups = { [name: string]: string[] };
export const datasetFeature = createFeature({
    name: 'dataset',
    reducer: datasetReducer,
    extraSelectors: ({selectDatasetState, selectEntities, selectLastId}) => ({
        ...datasetAdapter.getSelectors(selectDatasetState),
        selectLastDataset: createSelector(
            selectEntities,
            selectLastId,
            (entities, lastId) => entities[lastId],
        ),
        selectDataset: (id: number) =>
            createSelector(selectEntities, (entities) => entities[id]),
        selectIsSaved: (id: number) =>
            createSelector(
                selectEntities,
                (entities) => !!(entities[id] && entities[id]!.saved),
            ),
        selectAllSaved: createSelector(selectEntities, (entities) => Object.values(entities).every((entity) => entity && entity.saved)),

        selectLoadingComplete: (id: number) =>
            createSelector(
                selectEntities,
                (entities) =>
                    !!(
                        entities[id] && entities[id]!.loadingStatus!.status === 'complete'
                    ),
            ),

        selectSummaryComplete: (id: number) =>
            createSelector(
                selectEntities,
                (entities) => !!(entities[id] && entities[id]!.summary),
            ),

        selectAnnotationComplete: (id: number) =>
            createSelector(
                selectEntities,
                (entities) =>
                    !!(
                        (
                            entities[id] &&
                            entities[id]!.annotations &&
                            transpose(entities[id]!.annotations as string[][]) // column by column
                                .slice(1) // exclude row headers
                                .map((col) => col.slice(1)) // exclude column headers
                                .filter(
                                    (col) =>
                                        col.filter((value, i) => col.indexOf(value) === i).length >
                                        1, // distinct values
                                ).length > 0
                        ) // only columns with more than 1 distinct value
                    ),
            ), // at least 1 column with more than 1 distinct value

        selectStatisticalDesignComplete: (id: number) =>
            createSelector(
                selectEntities,
                (entities) =>
                    !!(
                        entities[id] &&
                        entities[id]!.statisticalDesign &&
                        entities[id]!.statisticalDesign!.analysisGroup &&
                        entities[id]!.statisticalDesign!.comparisonGroup1 &&
                        entities[id]!.statisticalDesign!.comparisonGroup2 &&
                        entities[id]!.statisticalDesign!.comparisonGroup1 !==
                        entities[id]!.statisticalDesign!.comparisonGroup2
                    ),
            ),

        selectAnalysisGroups: (id: number) =>
            createSelector(selectEntities, (entities): AnalysisGroups => {
                const dataset = entities[id];
                if (!(dataset && dataset.annotations)) return {};
                return transpose(dataset.annotations) // Column by column
                    .slice(1) // Remove row ids column
                    .map((column) => ({// Create groups with distinct values
                        name: column[0],
                        values: new Set(column.slice(1)),
                    }))
                    .filter((group) => group.values.size >= 2) // Filter groups suitable for analysis
                    .reduce(
                        (groups, group) => ({
                            ...groups,
                            [group.name]: Array.from(group.values),
                        }),
                        {},
                    );
            }),

        selectCovariates: (id: number) => createSelector(selectEntities, (entities): Covariate[] => {
            return entities[id] && entities[id]!.statisticalDesign && entities[id]!.statisticalDesign!.covariances || [];
        }),

        selectCovariancesAllSelected: (id: number) => createSelector(selectEntities, (entities): boolean => {
            return entities[id] && entities[id]?.statisticalDesign && entities[id]?.statisticalDesign?.covariances?.every(cov => cov.value) || false;
        }),

        selectCovariancesSomeSelected: (id: number) => createSelector(selectEntities, (entities): boolean => {
            return entities[id] && entities[id]?.statisticalDesign && entities[id]?.statisticalDesign?.covariances?.some(cov => cov.value) || false;
        }),

        selectSummaryParameters: (id: number) => createSelector(selectEntities, (entities): Parameter[] => {
          return entities[id] && entities[id]!.summary && entities[id]!.summary!.parameters || [];
        })
    }),
});
