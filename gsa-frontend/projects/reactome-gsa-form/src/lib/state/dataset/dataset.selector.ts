import {datasetAdapter} from './dataset.state';
import {createFeature, createSelector} from '@ngrx/store';
import {datasetReducer} from './dataset.reducer';
import {transpose} from 'reactome-table';
import {Covariate} from "../../model/dataset.model";
import {Parameter} from "../../model/parameter.model";

export type AnalysisGroups = Record<string, string[]>;
export type SampleGroups = Record<string, string[]>;

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
                .filter((col) =>
                  col
                    .filter(s => s) // remove empty string
                    .filter((value, i) => col.indexOf(value) === i) // distinct values
                    .length >= 2,// only columns with at least 2 distinct values
                ).length > 0
            )
          ),
      ), // at least 1 column with at least 2 distinct values

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

    selectParametersComplete: (id: number) =>
      createSelector(
        selectEntities,
        (entities) => entities[id] !== undefined // TODO Check that all required dataset parameters are filled
      ),


    selectAnalysisGroups: (id: number) =>
      createSelector(selectEntities, (entities): AnalysisGroups => {
        const dataset = entities[id];
        if (!(dataset && dataset.annotations)) return {};
        return transpose(dataset.annotations) // Column by column
          .slice(1) // Remove row ids column
          .map((column) => ({// Create groups with distinct values
            name: column[0],
            values: new Set(column.slice(1).filter(s => s)),
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

    /**
     * Only supports columns where all values are defined AND create pairs of samples
     * @param id
     */
    selectSampleGroups: (id: number) =>
      createSelector(selectEntities, (entities): SampleGroups => {
        const dataset = entities[id];
        if (!(dataset && dataset.annotations)) return {};

        const analysisColumn = transpose(dataset.annotations).find(column => column[0] === dataset?.statisticalDesign?.analysisGroup)?.slice(1)
        if (!analysisColumn) return {}

        return transpose(dataset.annotations) // Column by column
          .slice(1) // Remove row ids column
          .map((column) => ({// Create groups with distinct values
            name: column[0],
            values: column.slice(1),
          }))
          .filter((group) => dataset!.statisticalDesign!.analysisGroup !== group.name) // Remove analysis group
          .filter((group) => {
            const group1Values = new Set<string>()
            const group2Values = new Set<string>()
            for (let i = 0; i < analysisColumn.length; i++) {
              const analysedValue = analysisColumn[i];
              for (let [comparisonGroup, values] of [
                [dataset!.statisticalDesign!.comparisonGroup1, group1Values],
                [dataset!.statisticalDesign!.comparisonGroup2, group2Values]
              ] as [string, Set<string>][]) {
                if (analysedValue === comparisonGroup) {
                  const value = group.values[i];
                  if (values.has(value)) return false; // remove columns where a "pair" is associated more than once to the same condition
                  values.add(value)
                }
              }
            }
            console.error(group1Values, group2Values)

            return setsEqual(group1Values, group2Values) // Sample group columns should have one distinct value for each comparison value,
            // and those values should be the same in each group to form pairs
          })
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

const setsEqual = <T>(a: Set<T>, b: Set<T>) => a.size === b.size && [...a].every(v => b.has(v));

