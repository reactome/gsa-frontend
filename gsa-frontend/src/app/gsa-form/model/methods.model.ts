export interface ParameterJSON {
  default: string;
  description: string;
  display_name: string;
  name: string;
  scope: string;
  type: ParameterType;
  values?: string[];
}

export class MethodParameter implements ParameterJSON {
  default: string;
  description: string;
  display_name: string;
  scope: string;
  type: ParameterType;
  values: string[] | undefined;
  name: string;
  value: any;

  constructor(definition: ParameterJSON) {

    this.display_name = definition.display_name;
    this.description = definition.description
    this.scope = definition.scope
    this.type = definition.type
    this.values = definition.values
    this.name = definition.name

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
  int = "int",
  email = "email",
}

export class Method {
  parameters: MethodParameter[];

  constructor(public name: string, public description: string, parameters: ParameterJSON[]) {
    this.name = name;
    this.description = description;
    this.parameters = parameters.map(param => new MethodParameter(param));
  }
}


