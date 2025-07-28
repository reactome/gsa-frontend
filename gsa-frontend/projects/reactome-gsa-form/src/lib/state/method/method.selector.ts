import {createFeature, createSelector} from "@ngrx/store";
import {methodReducer} from "./method.reducer";
import {Method, methodAdapter} from "./method.state";

export const methodFeature = createFeature({
  name: 'method',
  reducer: methodReducer,
  extraSelectors: ({selectMethodState, selectEntities, selectSelectedMethodName}) => ({
    ...methodAdapter.getSelectors(selectMethodState),
    selectMethod: (name: string) => createSelector(selectEntities, (entities) => entities[name]),
    selectSelectedMethod: createSelector(selectEntities, selectSelectedMethodName, (entities, selectedMethodName) => selectedMethodName === null ? null : (entities[selectedMethodName] || null) as Method | null),
  })
})
