import {ActionReducer, createReducer, on} from "@ngrx/store";
import {initialState, parameterAdapter, ParameterState} from "./parameter.state";
import {parameterActions} from "./parameter.action";


export const parameterReducer: ActionReducer<ParameterState> = createReducer(
  initialState,
  on(parameterActions.addMany, (state, {parameters}) => parameterAdapter.addMany(parameters, state)),
  on(parameterActions.update, (state, {update}) => parameterAdapter.updateOne(update, state)),
  on(parameterActions.reset, (state, {parameters}) => parameterAdapter.updateMany(
    parameters.map(parameter => ({
      id: parameter.id,
      changes: {
        value: parameter.default
      }
    })), state))
)
