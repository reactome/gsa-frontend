import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Method} from "./method.state";
import {Update} from "@ngrx/entity";
import {Parameter} from "../../model/parameter.model";

export const methodActions = createActionGroup({
  source: 'GSA Method',
  events: {
    'load': emptyProps(),
    'load success': props<{ methods: Method[] }>(),
    'load failure': props<{ error: any }>(),
    'select': props<{ methodName: string }>(),
    'update': props<{ update: Update<Method> }>(),
    'set params': props<{ methodName: string, parameters: Parameter[] }>(),
    'set selected params': props<{ parameters: Parameter[] }>(),
  }
})
