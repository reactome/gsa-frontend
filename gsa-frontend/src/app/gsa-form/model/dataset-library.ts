// Http post:

export namespace Abstract {
  export interface Paginated<T = any, Field = string> {
    content: T[];
    totalElements: number;
    sort: Sort<Field>[];
    pageable: {
      first: boolean,
      last: boolean,
      pageNumber: number,
      pageSize: number,
      totalPages: number,
      paged: boolean
    };
  }

  export interface Query<ContinuousFields = string, DiscreteFields = string> {
    query: string;
    filters: Filter<ContinuousFields, DiscreteFields>[];
    sortBy: Sort<ContinuousFields | DiscreteFields>[];
    page: number;
    pageSize: number;
  }

  export interface DiscreteFilter<F = string> {
    name: F;
    values: any[];
  }

  export interface ContinuousFilter<F = string> {
    name: F;
    min?: number;
    max?: number;
  }

  export interface Sort<F = string> {
    field: F;
    order?: 'ASC' | 'DESC';
  }

  export type Filter<ContinuousFields, DiscreteFields> =
    DiscreteFilter<DiscreteFields>
    | ContinuousFilter<ContinuousFields>;

}


export namespace Library {

  export interface Dataset {
    species: string;
    categories: string[];
    id: string;
    label: string;
    description?: string;
  }

  type ContinuousFields = 'sample-count';
  type DiscreteFields = 'species' | 'category';

  export interface Query extends Abstract.Query<ContinuousFields, DiscreteFields> {
  }

  export interface Result extends Abstract.Paginated<Dataset, ContinuousFields | DiscreteFields> {

  }

  const exampleQuery: Query = {
    query: "*",
    filters: [
      {name: 'species', values: ['Homo sapiens', 'Mus musculus']},
      {name: 'sample-count', min: 15, max: 40},
      {name: "category", values: ["dermatology"]}
    ],
    sortBy: [
      {field: "category"},
      {field: "sample-count", order: "DESC"}
    ],
    page: 0,
    pageSize: 50
  }

  const exampleResponse: Result = {
    content: [
      {
        id: 'melanoma57',
        categories: ["dermatology"],
        species: "Homo sapiens",
        description: "*",
        label: "*"

      },
      {
        id: 'melanoma50',
        categories: ["dermatology"],
        species: "Mus musculus",
        description: "*",
        label: "*"
      }
    ],
    pageable: {
      first: true,
      last: false,
      paged: true,
      pageSize: 50,
      pageNumber: 0,
      totalPages: 10
    },
    sort: [
      {field: "category"},
      {field: "sample-count", order: "DESC"}
    ],
    totalElements: 480
  }
}

export interface SearchLibraryDataset {

}
