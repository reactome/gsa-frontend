import {ActionReducer, createReducer, on} from '@ngrx/store';
import {datasetAdapter, DatasetState, initialState} from './dataset.state';
import {datasetActions} from './dataset.actions';
import {DataSummary} from '../../model/load-dataset.model';
import {StatisticalDesign} from "../../model/dataset.model";
import {Subset} from "../../model/utils.model";
import {cp, transpose} from "../../utilities/table/state/table.util";
import {isDefined} from "../../utilities/utils";

export const datasetReducer: ActionReducer<DatasetState> = createReducer(
  initialState,
  on(datasetActions.add, (state) =>
    datasetAdapter.addOne(
      {id: state.lastId, saved: false},
      {
        ...state,
        lastId: state.lastId + 1,
      },
    ),
  ),
  on(datasetActions.delete, (state, {id}) =>
    datasetAdapter.removeOne(id, state),
  ),
  on(datasetActions.clear, (state, {id}) =>
    datasetAdapter.setOne({id, saved: false}, state),
  ),
  on(datasetActions.save, (state, {id}) =>
    datasetAdapter.updateOne(
      {
        id,
        changes: {saved: true},
      },
      state,
    ),
  ),
  on(datasetActions.loadSubmitted, (state, {loadingId, id}) =>
    datasetAdapter.updateOne(
      {
        id,
        changes: {
          loadingStatus: {
            id: loadingId,
            status: 'running',
          },
        },
      },
      state,
    ),
  ),
  on(datasetActions.setLoadStatus, (state, {loadingStatus, id}) =>
    datasetAdapter.updateOne(
      {
        id,
        changes: {loadingStatus},
      },
      state,
    ),
  ),
  on(datasetActions.setSummary, (state, {summary, id}) =>
    datasetAdapter.updateOne(
      {
        id,
        changes: {summary},
      },
      state,
    ),
  ),
  on(datasetActions.setAnnotations, (state, {annotations, id}) => {
      return datasetAdapter.updateOne(
        {
          id,
          changes: {
            annotations: annotations,
          },
        },
        state,
      );
    },
  ),

  on(datasetActions.initAnnotationColumns, (state) =>
    datasetAdapter.updateMany(state.ids.map(id => state.entities[id]).filter(isDefined).map(dataset => {
      const annotations = dataset.annotations!;

      const annotationsWithSimpleIds = cp(annotations);
      annotationsWithSimpleIds[0][0] = 'sample_ids';

      return {
        id: dataset.id,
        changes: {
          annotationColumns: new Map<string, string[]>(transpose(annotationsWithSimpleIds).map(col => [col[0], col.slice(1)]))
        }
      }
    }), state)),

  on(datasetActions.uploadComplete, (state, {uploadData, name, typeId, id}) =>
    datasetAdapter.updateOne(
      {
        id,
        changes: {
          summary: {
            id: uploadData.data_token,
            title: name,
            type: typeId,
            sample_ids: uploadData.sample_names,
          },
        },
      },
      state,
    ),
  ),
  on(datasetActions.updateSummary, (state, {update}) => {
    if (!state.entities[update.id]) return state;
    return datasetAdapter.updateOne(
      {
        id: update.id as number,
        changes: {
          summary: {
            ...state.entities[update.id]!.summary,
            ...(update.changes as Pick<DataSummary, keyof DataSummary>),
          },
        },
      },
      state,
    );
  }),

  //todo delete this reducer
  on(datasetActions.updateStatisticalDesign, (state, {update}) => {
    if (!state.entities[update.id]) return state;
    return datasetAdapter.updateOne(
      {
        id: update.id as number,
        changes: {
          statisticalDesign: {
            ...state.entities[update.id]!.statisticalDesign,
            ...(update.changes as Subset<StatisticalDesign>)
          },
        },
      },
      state,
    );
  }),

    on(datasetActions.initStatisticalDesign, (state, {id}) => {
            const summary = state.entities[id]!.summary!;
            const defaultCovariances = new Set<string>(summary.default_parameters!
                .find(param => param.name === 'covariates')?.value
                .split(',') || []);
            const defaultGroup1 = summary.default_parameters!.filter((param) => param.name === 'comparison_group_1')[0]?.value;
            const defaultGroup2 = summary.default_parameters!.filter((param) => param.name === 'comparison_group_2')[0]?.value;
            const defaultComparisonFactor = summary.default_parameters!.filter((param) => param.name === 'analysis_group')[0]?.value;
            return datasetAdapter.updateOne(
                {
                    id,
                    changes: {
                        statisticalDesign: {
                            analysisGroup: defaultComparisonFactor,
                            comparisonGroup1: defaultGroup1,
                            comparisonGroup2: defaultGroup2,
                            defaultCovariances,
                            defaultGroup1,
                            defaultGroup2,
                            defaultComparisonFactor,
                            covariances: []
                        },
                    },
                },
                state,
            );
        },
    ),

  on(datasetActions.initCovariances, (state, {id}) => {
      const dataset = state.entities[id]!;
      const stats = dataset?.statisticalDesign!;
      if (!stats) return state;
      return datasetAdapter.updateOne(
        {
          id,
          changes: {
            statisticalDesign: {
              ...stats,
              covariances: dataset.annotations?.[0].slice(1) //slice the first element, which is the empty string
                .filter(name => name !== stats.analysisGroup)
                .map(name => ({name, value: stats.defaultCovariances.has(name)})) || []
            },
          },
        },
        state,
      );
    },
  ),

  on(datasetActions.setAnalysisGroup, (state, {group, id}) => {
    const dataset = state.entities[id]!;
    const stats = dataset.statisticalDesign;
    if (!stats) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        statisticalDesign: {
          ...stats,
          analysisGroup: group,
          comparisonGroup1: group === stats.defaultComparisonFactor ? stats.defaultGroup1 : undefined,
          comparisonGroup2: group === stats.defaultComparisonFactor ? stats.defaultGroup2 : undefined,
        }
      }
    }, state)
  }),

  on(datasetActions.setComparisonGroup1, (state, {group, id}) => {
    const stats = state.entities[id]!.statisticalDesign!;
    if (!stats) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        statisticalDesign: {
          ...stats,
          comparisonGroup1: group
        }
      }
    }, state)
  }), on(datasetActions.setComparisonGroup2, (state, {group, id}) => {
    const stats = state.entities[id]!.statisticalDesign!;
    if (!stats) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        statisticalDesign: {
          ...stats,
          comparisonGroup2: group
        }
      }
    }, state)
  }),
  on(datasetActions.setCovariateValue, (state, {group, value, id}) => {
    const stats = state.entities[id]!.statisticalDesign!;
    if (!stats || !stats.covariances) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        statisticalDesign: {
          ...stats,
          covariances: stats.covariances.map(cov => cov.name === group ? {...cov, value} : cov)
        }
      }
    }, state)
  }),
  on(datasetActions.setCovariatesValue, (state, {value, id}) => {
    const stats = state.entities[id]!.statisticalDesign!;
    if (!stats || !stats.covariances) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        statisticalDesign: {
          ...stats,
          covariances: stats.covariances.map(cov => ({...cov, value}))
        }
      }
    }, state)
  }),

  on(datasetActions.setSummaryParameters, (state, {id, parameters}) => {
    const dataset = state.entities[id]!;
    const summary = dataset?.summary!;
    return datasetAdapter.updateOne({
      id,
      changes: {
        summary: {
          ...summary,
          parameters
        }
      }
    }, state)
  }),

  on(datasetActions.resetSummaryParameters, (state, {id}) => {
    const summary = state.entities[id]!?.summary!;
    if (!summary) return state;
    return datasetAdapter.updateOne({
      id,
      changes: {
        summary: {
          ...summary,
          parameters: summary.parameters?.map(p => ({...p, value: p.default}))
        }
      }
    }, state)
  }),
);
