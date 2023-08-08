import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {catchError, exhaustMap, map, mergeMap, of, take} from "rxjs";
import {FetchDatasetService} from "../../services/fetch-dataset.service";
import {datasetSourceActions} from "./dataset-source.action";
import {parameterActions} from "../parameter/parameter.action";
import {typeToParse} from "../../services/analysis-methods.service";

@Injectable()
export class DatasetSourceEffects {
  loadLocals = createEffect(() => this.actions$.pipe(
    ofType(datasetSourceActions.loadLocals),
    exhaustMap(() => this.service.fetchLocalDataSources().pipe(
      map(datasetSources => datasetSourceActions.loadLocalsSuccess({locals: datasetSources})),
      catchError((err) => of(datasetSourceActions.loadLocalsFailure({error: err})))
    )),
    take(1)
  ))

  loadExamples = createEffect(() => this.actions$.pipe(
    ofType(datasetSourceActions.loadExamples),
    exhaustMap(() => this.service.fetchExampleDataSources().pipe(
      map(datasetSources => datasetSourceActions.loadExamplesSuccess({examples: datasetSources})),
      catchError((err) => of(datasetSourceActions.loadLocalsFailure({error: err})))
    )),
    take(1)
  ))

  loadExternals = createEffect(() => this.actions$.pipe(
    ofType(datasetSourceActions.loadExternal),
    exhaustMap(() => this.service.fetchExternalDataSources().pipe(
      map(externals => {
        externals.forEach(external => external.parameters.forEach(param => {
          param.id = `${external.id} - ${param.name}`;
          param.value = typeToParse[param.type](param.default);
          param.default = typeToParse[param.type](param.default);
        }))
        return externals;
      }),
      mergeMap(datasetSources => [
        datasetSourceActions.loadExternalSuccess({externals: datasetSources}),
        parameterActions.addMany({parameters: datasetSources.flatMap(source => source.parameters)})
      ]),
      catchError((err) => of(datasetSourceActions.loadLocalsFailure({error: err}))),
      take(1)
    )),
  ))

  constructor(
    private actions$: Actions,
    private service: FetchDatasetService
  ) {
  }
}
