import {Actions, createEffect, ofType} from "@ngrx/effects";


import {catchError, delay, delayWhen, filter, map, mergeMap, of, switchMap, tap, timer} from "rxjs";
import {AnalysisService} from "../../services/analysis.service";
import {analysisActions} from "./analysis.actions";
import {TypedAction} from "@ngrx/store/src/models";
import {Injectable} from "@angular/core";

@Injectable()
export class AnalysisEffects {

  analysisLoad$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.load),
    switchMap(({
                 method,
                 parameters,
                 datasets,
                 reportsRequired
               }) => this.analysisService.submitQuery(method, parameters, datasets).pipe(
      tap(() => this.reportsRequired = reportsRequired),
      map((analysisId) => analysisActions.loadSuccess({analysisId})),
      catchError((error) =>
        error.status === 503 ?
          of(analysisActions.loadOverloaded({method, parameters, datasets, reportsRequired})) :
          of(analysisActions.loadFailure({error}))),
    ))
  ));

  loadOverloaded$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.loadOverloaded),
    delay(60_000),
    map((params) => analysisActions.load(params))
  ))

  loadSuccessToGetLoadingStatus$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.loadSuccess),
    map(({analysisId}) => analysisActions.getLoadingStatus({analysisId}))
  ))

  getLoadingStatus$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.getLoadingStatus, analysisActions.cancel),
    switchMap(({analysisId, type}) =>
      type === analysisActions.cancel.type
        ? this.analysisService.cancelAnalysis(analysisId)
        : this.analysisService.getAnalysisLoadingStatus(analysisId).pipe(
          mergeMap((status) => {
            const actions: TypedAction<any>[] = [analysisActions.setLoadingStatus({status})];
            if (status.status === 'failed') actions.push(analysisActions.getLoadingStatusError({error: status.description}));
            else if (status.status !== 'complete') actions.push(analysisActions.getLoadingStatus({analysisId}));
            return actions;
          }),
          delayWhen((action) =>
            action.type === analysisActions.getLoadingStatus.type
              ? timer(1000)
              : timer(0),
          ),
          catchError((error) => of(analysisActions.getLoadingStatusError({error}))),
        ))
  ))

  setLoadingToResults$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.setLoadingStatus),
    filter(({status}) => status.status === 'complete'),
    switchMap(({status}) => this.analysisService.getAnalysisResults(status.id).pipe(
      mergeMap((result) => {
        const actions: TypedAction<any>[] = [analysisActions.setAnalysisResults({result})];
        if (this.reportsRequired) actions.push(analysisActions.getReportLoadingStatus({analysisId: status.id}))
        return actions;
      }),
      catchError((error) => of(analysisActions.getAnalysisResultsError({error}))),
    ))
  ));

  getReportLoadingStatus$ = createEffect(() => this.actions$.pipe(
    ofType(analysisActions.getReportLoadingStatus, analysisActions.cancel),
    switchMap(({analysisId, type}) =>
      type === analysisActions.cancel.type
        ? this.analysisService.cancelAnalysis(analysisId)
        : this.analysisService.getReportLoadingStatus(analysisId).pipe(
          mergeMap((status) => {
            const actions: TypedAction<any>[] = [analysisActions.setReportLoadingStatus({status})];
            if (status.status === 'failed') actions.push(analysisActions.getLoadingStatusError({error: status.description}));
            else if (status.status !== 'complete') actions.push(analysisActions.getReportLoadingStatus({analysisId}));
            return actions;
          }),
          delayWhen((action) =>
            action.type === analysisActions.getReportLoadingStatus.type
              ? timer(1000)
              : timer(0),
          ),
          catchError((error) => of(analysisActions.getReportLoadingStatusError({error}))),
        ))
  ))


  reportsRequired = false;

  constructor(
    private actions$: Actions,
    private analysisService: AnalysisService
  ) {
  }
}
