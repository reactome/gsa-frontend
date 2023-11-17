import {ActionReducer, createReducer, on} from "@ngrx/store";
import {initialState, Method, methodAdapter, MethodState} from "./method.state";
import {methodActions} from "./method.action";
import {EntityHelper} from "../../utilities/utils";


const helper = new EntityHelper<Method, MethodState>(methodAdapter);

export const methodReducer: ActionReducer<MethodState> = createReducer(
  initialState,
  on(methodActions.loadSuccess, (state, {methods}) =>
    methodAdapter.addMany(methods.map(method => ({
        ...method,
        parameters: method.parameters.filter(param => param.scope !== 'common') // Method sdo not keep common
      })), {
        ...state,
        commonParameters: methods[0].parameters.filter(param => param.scope === 'common') // They are transferred to global status
      }
    )),
  on(methodActions.update, (state, {update}) => methodAdapter.updateOne(update, state)),
  on(methodActions.setParams, (state, {methodName, parameters}) => methodAdapter.updateOne({
    id: methodName,
    changes: {parameters}
  }, state)),
  on(methodActions.resetParams, (state, {methodName}) => helper.update(methodName, state,
    method => ({
      parameters: method.parameters.map(param => ({...param, value: param.default}))
    }))
  ),
  on(methodActions.updateSelectedParams, (state, {parameters}) => !state.selectedMethodName ?
    state :
    helper.update(state.selectedMethodName, state,
      method => ({
        parameters: method.parameters.map(originalParam => parameters.find(param => param.name === originalParam.name) || originalParam)
      }))
  ),
  on(methodActions.updateSelectedParam, (state, {param}) => !state.selectedMethodName ?
    state :
    helper.update(state.selectedMethodName, state,
      method => ({
        parameters: method.parameters.map(originalParam => originalParam.name === param.name ? param : originalParam)
      })
    )),
  on(methodActions.updateCommonParam, (state, {param}) => ({
    ...state,
    commonParameters: state.commonParameters.map(originalParam => originalParam.name === param.name ? param : originalParam)
  })),
  on(methodActions.select, (state, {methodName}) => ({...state, selectedMethodName: methodName})),
)
