import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Method} from "./method.state";
import {Update} from "@ngrx/entity";
import {MethodJSON} from "../../services/analysis-methods.service";

export const methodActions = createActionGroup({
  source: 'GSA Methods',
  events: {
    'load': emptyProps(),
    'load success': props<{ methods: MethodJSON[] }>(),
    'load failure': props<{ error: any }>(),
    'select': props<{ method: Method }>(),
    'update': props<{ update: Update<Method> }>(),
  }
})
