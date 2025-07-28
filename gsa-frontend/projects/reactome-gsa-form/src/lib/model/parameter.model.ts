export interface Parameter<T = any> {
  id: string;
  default: T;
  description: string;
  display_name: string;
  name: string;
  scope: Scope;
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

export type Scope = 'common' | 'analysis' | 'dataset';
