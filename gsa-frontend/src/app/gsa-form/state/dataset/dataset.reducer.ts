import {ActionReducer, createReducer, on} from '@ngrx/store';
import {datasetAdapter, DatasetState, initialState} from "./dataset.state";
import {datasetActions} from "./dataset.actions";
import {DataSummary} from "../../model/load-dataset.model";

export const datasetReducer: ActionReducer<DatasetState> = createReducer(
  initialState,
  on(datasetActions.add, (state) => datasetAdapter.addOne({id: state.lastId, saved: false}, {
    ...state,
    lastId: state.lastId + 1
  })),
  on(datasetActions.delete, (state, {id}) => datasetAdapter.removeOne(id, state)),
  on(datasetActions.save, (state, {id}) => datasetAdapter.updateOne({
    id,
    changes: {saved: true}
  }, state)),
  on(datasetActions.loadSubmitted, (state, {loadingId, id}) => datasetAdapter.updateOne({
    id,
    changes: {
      loadingStatus: {
        id: loadingId,
        status: 'running'
      }
    }
  }, state)),
  on(datasetActions.setLoadStatus, (state, {loadingStatus, id}) => datasetAdapter.updateOne({
    id,
    changes: {loadingStatus}
  }, state)),
  on(datasetActions.setSummary, (state, {summary, loadingId, id}) => datasetAdapter.updateOne({
    id,
    changes: {summary}
  }, state)),
  on(datasetActions.setAnnotations, (state, {annotations, id}) => datasetAdapter.updateOne({
    id,
    changes: {annotations}
  }, state)),
  on(datasetActions.uploadComplete, (state, {uploadData, name, typeId, id}) => datasetAdapter.updateOne({
    id,
    changes: {
      summary: {
        id: uploadData.data_token,
        title: name,
        type: typeId,
        sample_ids: uploadData.sample_names
      }
    }
  }, state)),
  on(datasetActions.updateSummary, (state, {update}) => {
    if (!state.entities[update.id]) return state;
    return datasetAdapter.updateOne({
      id: update.id as number,
      changes: {
        summary: {
          ...state.entities[update.id]!.summary,
          ...(update.changes as Pick<DataSummary, keyof DataSummary>)
        }
      }
    }, state)
  })
);


