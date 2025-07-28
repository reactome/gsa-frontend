import {createFeature} from "@ngrx/store";
import {searchResultReducer} from "./search-result.reducer";
import {searchResultAdapter} from "./search-result.state";

export const searchResultFeature = createFeature({
  name: 'search',
  reducer: searchResultReducer,
  extraSelectors: ({selectSearchState}) => {
    const selectors = searchResultAdapter.getSelectors(selectSearchState);
    return ({
      ...selectors
    });
  }
})
