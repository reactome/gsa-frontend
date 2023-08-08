import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface Method {
  name: string;
  description: string;
  parameterIds: string[];
}

export interface MethodState extends EntityState<Method> {
  selectedMethodName: string | null;
}

export const methodAdapter = createEntityAdapter<Method>({
  selectId: model => model.name
})

export const initialState: MethodState = methodAdapter.getInitialState({selectedMethodName: null})
