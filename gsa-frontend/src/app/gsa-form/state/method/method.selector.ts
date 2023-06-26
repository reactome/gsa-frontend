import {createFeature, createSelector} from "@ngrx/store";
import {methodReducer} from "./method.reducer";
import {methodAdapter} from "./method.state";

const selectors = methodAdapter.getSelectors();

export const methodFeature = createFeature({
  name: 'method',
  reducer: methodReducer,
  extraSelectors: ({selectMethodState, selectEntities, selectSelectedMethodName}) => ({
    selectMethodDict: createSelector(selectMethodState, selectors.selectEntities),
    selectMethodIds: createSelector(selectMethodState, selectors.selectIds),
    selectAll: createSelector(selectMethodState, selectors.selectAll),
    selectTotal: createSelector(selectMethodState, selectors.selectTotal),
    selectSelectedMethod: createSelector(selectEntities, selectSelectedMethodName, (entities, selectedMethodName) => selectedMethodName === null ? null : entities[selectedMethodName] || null)
  })
})
