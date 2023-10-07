import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {AnalysisMethodsService, typeToParse} from "../../services/analysis-methods.service";
import {methodActions} from "./method.action";
import {catchError, exhaustMap, map, of} from "rxjs";
import {ParameterType} from "../../model/methods.model";

@Injectable()
export class MethodEffects {
  loadMethods$ = createEffect(() => this.actions$.pipe(
      ofType(methodActions.load),
      exhaustMap(() => this.methodService.getAll().pipe(
          map(methods => {
            methods.forEach(method => method.parameters.forEach(param => {
              param.type = param.name === 'email' ? ParameterType.email : param.type;
              param.value = typeToParse[param.type](param.default);
              param.default = typeToParse[param.type](param.default);
            }));
            return methodActions.loadSuccess({methods})
          }),
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
