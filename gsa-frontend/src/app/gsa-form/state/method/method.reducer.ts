import {ActionReducer, createReducer, on} from "@ngrx/store";
import {initialState, methodAdapter, MethodState} from "./method.state";
import {methodActions} from "./method.action";

export const methodReducer: ActionReducer<MethodState> = createReducer(
    initialState,
    on(methodActions.loadSuccess, (state, {methods}) => methodAdapter.addMany(methods.map(method => ({...method, parameters: method.parameters})), state)),
    on(methodActions.update, (state, {update}) => methodAdapter.updateOne(update, state)),
    on(methodActions.setParams, (state, {methodName, parameters}) => methodAdapter.updateOne({
        id: methodName,
        changes: {parameters}
    }, state)),
    on(methodActions.setSelectedParams, (state, {parameters}) => state.selectedMethodName ?
        methodAdapter.updateOne({
            id: state.selectedMethodName,
            changes: {parameters}
        }, state) :
        state),
    on(methodActions.select, (state, {methodName}) => ({...state, selectedMethodName: methodName})),
)
