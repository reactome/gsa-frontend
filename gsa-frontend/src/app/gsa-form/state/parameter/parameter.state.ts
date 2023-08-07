import {createEntityAdapter, EntityState} from "@ngrx/entity";
export interface Parameter<T = any> {
  id: string;
  default: T;
  description: string;
  display_name: string;
  name: string;
  scope: string;
  type: ParameterType;
  required?: boolean;
  values?: string[];
  value?: T;
}

export enum ParameterType {
  bool = "bool",
  float = "float",
  string = "string",
  int = "int",
  email = "email"
}


export interface ParameterState extends EntityState<Parameter> {
}

export const parameterAdapter = createEntityAdapter<Parameter>();

export const initialState: ParameterState = parameterAdapter.getInitialState();
