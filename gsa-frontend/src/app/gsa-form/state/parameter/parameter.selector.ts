import {createFeature, createSelector} from "@ngrx/store";
import {parameterReducer} from "./parameter.reducer";
import {parameterAdapter} from "./parameter.state";
import {isDefined} from "../../utilities/utils";
export const parameterFeature = createFeature({
  name: 'parameter',
  reducer: parameterReducer,
  extraSelectors: ({selectParameterState, selectEntities}) => ({
    ...parameterAdapter.getSelectors(selectParameterState),
    selectParameter: (id: string) =>
      createSelector(selectEntities, entities => entities[id]),
    selectParameters: (ids: string[]) =>
      createSelector(selectEntities, entities => ids.map(id => entities[id]).filter(isDefined)),
  })
})
