import {ActionReducer, createReducer, on} from "@ngrx/store";
import {datasetSourceAdapter, DatasetSourceState, initialState} from "./dataset-source.state";
import {datasetSourceActions} from "./dataset-source.action";


export const datasetSourceReducer: ActionReducer<DatasetSourceState> = createReducer(
    initialState,
    on(datasetSourceActions.loadLocalsSuccess, (state, {locals}) => datasetSourceAdapter.addMany(
        locals.map(local => ({
            ...local,
            source: 'Local'
        })), state)),
    on(datasetSourceActions.loadExamplesSuccess, (state, {examples}) => datasetSourceAdapter.addMany(examples.map(example => ({
        ...example,
        source: 'Example'
    })), state)),
    on(datasetSourceActions.loadExternalSuccess, (state, {externals}) => datasetSourceAdapter.addMany(
        externals.map(external => ({
            ...external,
            source: 'External',
            parameterIds: external.parameters.map(param => param.id)
        })), state)),
    on(datasetSourceActions.select, (state, {toBeSelected}) => ({
        ...state,
        selectedSourceId: toBeSelected.id
    }))
)
