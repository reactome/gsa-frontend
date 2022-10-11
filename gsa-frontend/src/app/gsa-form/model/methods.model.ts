export interface ParameterJSON {
  default: string;
  description: string;
  display_name: string;
  name: string;
  scope: string;
  type: ParameterType;
  values?: string[];
}

export class Parameter {
  name: string;
  value: any;

  constructor(definition: ParameterJSON) {
    this.name = definition.name;
    switch (definition.type) {
      case ParameterType.bool:
        this.value = definition.default.toLowerCase() === "true";
        break
      case ParameterType.float:
        this.value = parseFloat(definition.default);
        break;
      case ParameterType.int:
        this.value = parseInt(definition.default);
        break;
      default:
        this.value = definition.default;
    }
  }

}

export enum ParameterType {
  bool = "bool",
  float = "float",
  string = "string",
  int = "int"
}


export interface Method {
  description?: string;
  name?: string;
  parameters?: ParameterJSON[];
}


