import {createActionGroup, props} from '@ngrx/store';
import {AnalysisResult} from "../../model/analysis-result.model";
import {LoadingStatus, PLoadingStatus} from "../../model/load-dataset.model";
import {Dataset} from "../dataset/dataset.state";
import {Method} from "../method/method.state";
import {Parameter} from "../../model/parameter.model";


export const analysisActions = createActionGroup({
    source: 'GSA Analysis',
    events: {
      'load': props<{method: Method, datasets: Dataset[], parameters: Parameter[], reportsRequired: boolean}>(),
      'load success': props<{analysisId: string}>(),
      'load failure': props<{error: any}>(),
      'get loading status': props<{analysisId: string}>(),

      'set loading status': props<{status: PLoadingStatus}>(),
      'get loading status error': props<{error: any}>(),
      'get analysis results': props<{analysisId: string}>(),

      'set analysis results': props<{result: AnalysisResult}>(),
      'get analysis results error': props<{error: any}>(),
      'get report loading status': props<{analysisId: string}>(),

      'set report loading status': props<{status: LoadingStatus}>(),
      'get report loading status error': props<{error: any}>(),

      'cancel': props<{analysisId:string}>(),
    }
})
