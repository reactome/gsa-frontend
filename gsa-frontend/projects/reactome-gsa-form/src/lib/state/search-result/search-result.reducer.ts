import {createReducer, on} from '@ngrx/store';
import {initialState, searchResultAdapter, SearchResultState} from './search-result.state';
import {searchResultActions} from './search-result.action';



export const searchResultReducer = createReducer(
  initialState,
  on(searchResultActions.loadSpeciesSuccess, (state, {speciesList}) => ({...state, speciesList})),

  on(searchResultActions.search, (state) => ({...state, searchStatus: 'pending'}) as SearchResultState),
  on(searchResultActions.searchSuccess, (state, {results}) => searchResultAdapter.setAll(results, {
    ...state,
    searchStatus: 'finished'
  }) as SearchResultState),
);
