import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {SearchResult} from "./search-result.state";

export const searchResultActions = createActionGroup({
  source: 'GSA Search',
  events: {

    'load species': emptyProps(),
    'load species success': props<{speciesList: string[]}>(),
    'load species failure': props<{error: any}>(),

    'search': props<{species?: string | null, keywords: string}>(),
    'search success': props<{results: SearchResult[]}>(),
    'search error': props<{error: any}>(),
  }}
);
