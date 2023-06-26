import {createFeature, createSelector} from "@ngrx/store";
import {parameterReducer} from "./parameter.reducer";
import {parameterAdapter} from "./parameter.state";
import {isDefined} from "../../utilities/utils";

const selectors = parameterAdapter.getSelectors();

export const parameterFeature = createFeature({
  name: 'parameter',
  reducer: parameterReducer,
  extraSelectors: ({selectParameterState, selectEntities}) => ({
    selectParameter: (id: string) =>
      createSelector(selectEntities, entities => entities[id]),
    selectParameters: (ids: string[]) =>
      createSelector(selectEntities, entities => ids.map(id => entities[id]).filter(isDefined)),
    selectParameterDict:
      createSelector(selectParameterState, selectors.selectEntities),
    selectParameterIds:
      createSelector(selectParameterState, selectors.selectIds),
    selectAll:
      createSelector(selectParameterState, selectors.selectAll),
    selectTotal:
      createSelector(selectParameterState, selectors.selectTotal),
  })
})
