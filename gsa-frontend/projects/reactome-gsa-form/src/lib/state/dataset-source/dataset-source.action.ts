import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {PDatasetSource} from "./dataset-source.state";
import {Parameter} from "../../model/parameter.model";

export const datasetSourceActions = createActionGroup({
  source: 'GSA Dataset Sources',
  events: {
    'load locals': emptyProps(),
    'load locals success': props<{locals: PDatasetSource[]}>(),
    'load locals failure': props<{error: any}>(),

    'load examples': emptyProps(),
    'load examples success': props<{examples: PDatasetSource[]}>(),
    'load examples failure': props<{error: any}>(),

    'load external': emptyProps(),
    'load external success': props<{externals: PDatasetSource[]}>(),
    'load external failure': props<{error: any}>(),

    'select': props<{toBeSelected: PDatasetSource}>(),
    'set parameter': props<{id: string, param: Parameter}>(),
    'set parameters': props<{id: string, parameters: Parameter[]}>(),
  }
})
