import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Parameter} from "../../model/parameter.model";


export interface Method {
  name: string;
  description: string;
  parameters: Parameter[];
  data_types: string[];
}

export interface MethodState extends EntityState<Method> {
  selectedMethodName: string | null;
  commonParameters: Parameter[]
}

export const methodAdapter = createEntityAdapter<Method>({
  selectId: model => model.name
})

export const initialState: MethodState = methodAdapter.getInitialState({selectedMethodName: null, commonParameters: []})
