export interface Dataset {
  description: string;
  id: string;

  get name(): string;
}

export class LocalDataset implements Dataset {
  description: string;
  id: string;
  private _name: string;

  constructor(description: string, id: string, name: string) {
    this.description = description;
    this.id = id;
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
  set name(name:string) {
    this._name = name;
  }
}

export class ExampleDataset implements Dataset {
  description: string;
  id: string;
  group: string;
  title: string;
  type: string;

  constructor(description: string, id: string, group: string, title: string, type: string) {
    this.description = description;
    this.id = id;
    this.group = group;
    this.title = title;
    this.type = type;
  }

  get name(): string {
    return this.title;
  }
}

export class ImportDataset implements Dataset {
  parameters: importParameter[];
  private _name: string;
  description: string;
  id: string;

  constructor(parameters: importParameter[], name: string, description: string, id: string) {
    this.parameters = parameters;
    this._name = name;
    this.description = description;
    this.id = id;
  }

  get name(): string {
    return this._name;
  }
  set name(name:string) {
    this._name = name;
  }
}

export interface importParameter {
  description: string;
  display_name: string;
  name: string;
  required: boolean;
  type: string;
}

