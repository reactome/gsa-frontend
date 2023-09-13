export interface Dataset {
  description: string;
  id: string;

  get name(): string;
}


export interface ImportParameter {
  description: string;
  display_name: string;
  name: string;
  required: boolean;
  type: string;
  value: any
}

