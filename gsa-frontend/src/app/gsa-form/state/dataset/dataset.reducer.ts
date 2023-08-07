import {ActionReducer, createReducer, on} from '@ngrx/store';
import {datasetAdapter, DatasetState, initialState} from "./dataset.state";
import {datasetActions} from "./dataset.actions";
import {DataSummary} from "../../model/load-dataset.model";


type TEST = { x: string, z: string };
export type test = Partial<TEST>
export type test2 = Pick<TEST, keyof TEST>


export const datasetReducer: ActionReducer<DatasetState> = createReducer(
    initialState,
    on(datasetActions.setLoadStatus, (state, {loadingStatus}) => datasetAdapter.addOne({id: loadingStatus.id, loadingStatus}, state)),
    on(datasetActions.setSummary, (state, {summary, loadingId}) => datasetAdapter.updateOne({id: loadingId, changes: {summary}}, state)),
    on(datasetActions.setAnnotations, (state, {annotations, id}) => datasetAdapter.updateOne({id: id, changes: {annotations}}, state)),
    on(datasetActions.uploadComplete, (state, {uploadData, name, typeId}) => datasetAdapter.addOne({
        id: uploadData.data_token,
        summary: {
            id: uploadData.data_token,
            title: name,
            type: typeId,
            sample_ids: uploadData.sample_names
        }
    }, state)),
    on(datasetActions.updateSummary, (state,{update}) => {
        if (!state.entities[update.id]) return state;
        return datasetAdapter.updateOne({
            id: update.id as string,
            changes: {
                summary: {
                    ...state.entities[update.id]!.summary,
                    ...(update.changes as Pick<DataSummary, keyof DataSummary>)
                }
            }
        }, state)
    })
);


