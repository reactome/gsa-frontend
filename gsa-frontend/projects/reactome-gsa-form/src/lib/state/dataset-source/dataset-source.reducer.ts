import {ActionReducer, createReducer, on} from "@ngrx/store";
import {datasetSourceAdapter, DatasetSourceState, initialState, PDatasetSource} from "./dataset-source.state";
import {datasetSourceActions} from "./dataset-source.action";
import {EntityHelper} from "../../utilities/utils";

const helper = new EntityHelper<PDatasetSource, DatasetSourceState>(datasetSourceAdapter);

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
    })), state)),
  on(datasetSourceActions.select, (state, {toBeSelected}) => ({
    ...state,
    selectedSourceId: toBeSelected.id
  })),
  on(datasetSourceActions.setParameter, (state, {id, param}) =>
    helper.update(id, state,
      source => ({
        parameters: source.parameters?.map(originalParam => originalParam.name === param.name ? param : originalParam)
      })
    )),
  on(datasetSourceActions.setParameters, (state, {id, parameters}) =>
    datasetSourceAdapter.updateOne({
      id,
      changes: {parameters}
    }, state)),
)
