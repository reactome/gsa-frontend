import {createEntityAdapter, EntityState} from "@ngrx/entity";
import {Parameter} from "../parameter/parameter.state";
import {Mapper} from "../../utilities/table/table.component";

export interface Method {
  name: string;
  description: string;
  parameters: Parameter[];
}

export interface MethodState extends EntityState<Method> {
  selectedMethodName: string | null;
}

export const methodAdapter = createEntityAdapter<Method>({
  selectId: model => model.name
})

export const initialState: MethodState = methodAdapter.getInitialState({selectedMethodName: null})
