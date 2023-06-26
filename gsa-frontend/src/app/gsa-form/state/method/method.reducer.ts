import {ActionReducer, createReducer, on} from "@ngrx/store";
import {initialState, methodAdapter, MethodState} from "./method.state";
import {methodActions} from "./method.action";


export const methodReducer: ActionReducer<MethodState> = createReducer(
  initialState,
  on(methodActions.loadSuccess, (state, {methods}) => methodAdapter.addMany(
    methods.map(method => ({
      name: method.name,
      description: method.description,
      parameterIds: method.parameters.map(param => param.id)
    })), state)
  ),
  on(methodActions.update, (state, {update}) => methodAdapter.updateOne(update, state)),
  on(methodActions.select, (state, {method}) => ({...state, selectedMethodName: method.name}))
)
