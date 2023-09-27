import {Request} from "../../model/analysis.model";
import {createEntityAdapter, EntityState} from "@ngrx/entity";
import Parameter = Request.Parameter;


export interface SearchResult {
  id: string;
  description: string;
  loading_parameters: Parameter[];
  resource_name: string;
  resource_loading_id: string;
  species: string;
  title: string;
}

export interface SearchResultState extends EntityState<SearchResult> {
  speciesList: string[];
  searchStatus: 'finished' | 'pending' | 'waiting';
}

export const searchResultAdapter = createEntityAdapter<SearchResult>();

export const initialState: SearchResultState = searchResultAdapter.getInitialState({
  speciesList: [],
  searchStatus: 'waiting'
})

