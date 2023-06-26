import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Parameter} from "./parameter.state";
import {Update} from "@ngrx/entity";

export const parameterActions = createActionGroup({
  source: 'GSA Parameters',
  events: {
    'add many': props<{ parameters: Parameter[] }>(),
    'update': props<{ update: Update<Parameter> }>(),
    'reset': props<{ parameters: Parameter[]}>(),
  }
})
