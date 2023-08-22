import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {AnalysisMethodsService, typeToParse} from "../../services/analysis-methods.service";
import {methodActions} from "./method.action";
import {catchError, exhaustMap, map, mergeMap, of} from "rxjs";
import {parameterActions} from "../parameter/parameter.action";

@Injectable()
export class MethodEffects {
  loadMethods$ = createEffect(() => this.actions$.pipe(
      ofType(methodActions.load),
      exhaustMap(() => this.methodService.getAll().pipe(
          map(methods => {
            methods.forEach(method => method.parameters.forEach(param => {
              param.id = `${method.name} - ${param.name}`;
              param.value = typeToParse[param.type](param.default);
              param.default = typeToParse[param.type](param.default);
            }));
            return methods;
          }),
          mergeMap(methods => [
            methodActions.loadSuccess({methods}),
            // parameterActions.addMany({parameters: methods.flatMap(method => method.parameters)})
          ]),
          catchError((err) => of(methodActions.loadFailure({error: err})))
        )
      )
    )
  )

  constructor(
    private actions$: Actions,
    private methodService: AnalysisMethodsService
  ) {
  }
}
