import {createReducer, on} from '@ngrx/store';
import {initialState, searchResultAdapter} from './search-result.state';
import {searchResultActions} from './search-result.action';


export const searchResultReducer = createReducer(
  initialState,
  on(searchResultActions.loadSpeciesSuccess, (state, {speciesList}) => ({...state, speciesList})),
  on(searchResultActions.searchSuccess, (state, {results}) => searchResultAdapter.setAll(results, state))
);

