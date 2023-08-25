import {ActionReducer, createReducer, on} from "@ngrx/store";
import {initialState, methodAdapter, MethodState} from "./method.state";
import {methodActions} from "./method.action";


// const helper = new EntityHelper<Method, MethodState>(methodAdapter);

export const methodReducer: ActionReducer<MethodState> = createReducer(
  initialState,
  on(methodActions.loadSuccess, (state, {methods}) => methodAdapter.addMany(methods, state)),
  on(methodActions.update, (state, {update}) => methodAdapter.updateOne(update, state)),
  on(methodActions.setParams, (state, {methodName, parameters}) => methodAdapter.updateOne({
    id: methodName,
    changes: {parameters}
  }, state)),
  on(methodActions.setSelectedParams, (state, {parameters}) => !state.selectedMethodName ?
    state :
    methodAdapter.updateOne({
    id: state.selectedMethodName,
    changes: {parameters}
  }, state)),
  on(methodActions.select, (state, {methodName}) => ({...state, selectedMethodName: methodName})),
)
