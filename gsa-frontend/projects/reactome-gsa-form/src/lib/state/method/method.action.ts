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
    'reset params': props<{ methodName: string }>(),

    'update common param': props<{ param: Parameter }>(),

    'update selected param': props<{ param: Parameter }>(),
    'update selected params': props<{ parameters: Parameter[] }>(),
  }
})
