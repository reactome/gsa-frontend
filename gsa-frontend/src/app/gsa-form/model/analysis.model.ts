export namespace Request {
  export interface Query {
    methodName: string;
    datasets: Dataset[];
    parameters: Parameter[];
  }

  interface Dataset {
    data: string;
    design: DataInformation;
    name: string;
    type: string;
    parameters?: Parameter[];
  }

  interface DataInformation {
    analysisGroup: string[];
    comparison: Comparison;
    samples: string[];

    [covariant: string]: string[] | Comparison;
  }

  interface Comparison {
    group1: string;
    group2: string;
  }

  interface Parameter {
    name: string
    value: any
  }

}

