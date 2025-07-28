import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {searchResultActions} from "./search-result.action";
import {catchError, exhaustMap, map, of, switchMap} from "rxjs";
import {FetchDatasetService} from "../../services/fetch-dataset.service";


@Injectable()
export class SearchResultEffects {
  loadSpecies = createEffect(() => this.actions$.pipe(
    ofType(searchResultActions.loadSpecies),
    exhaustMap(() => this.service.fetchSpeciesDataSources().pipe(
      map(speciesList => searchResultActions.loadSpeciesSuccess({speciesList})),
      catchError((err) => of(searchResultActions.loadSpeciesFailure({error: err})))
    )),
  ))

  search = createEffect(() => this.actions$.pipe(
    ofType(searchResultActions.search),
    switchMap(({species, keywords}) => this.service.search(keywords, species).pipe(
      map(results => searchResultActions.searchSuccess({results})),
      catchError((err) => of(searchResultActions.searchError({error: err})))
    )),
  ))


  constructor(
    private actions$: Actions,
    private service: FetchDatasetService
  ){}
}




