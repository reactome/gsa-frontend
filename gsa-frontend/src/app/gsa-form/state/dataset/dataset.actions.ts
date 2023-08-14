import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {DataSummary, PLoadingStatus} from "../../model/load-dataset.model";
import {StatisticalDesign} from "../../model/dataset.model";
import {UploadData} from "../../model/upload-dataset-model";
import {Update} from "@ngrx/entity";


export const datasetActions = createActionGroup({
    source: 'GSA Dataset',
    events: {
        'add': emptyProps(),
        'delete': props<{ id: number }>(),
        'save': props<{ id: number }>(),


        'upload': props<{ file: File, typeId: string, id: number }>(),
        'upload complete': props<{ uploadData: UploadData, name: string, typeId: string, id: number }>(),
        'upload error': props<{ error: any, id: number }>(),

        'load': props<{ resourceId: string, parameters: { name: string, value: any }[], id: number }>(),
        'load submitted': props<{ loadingId: string, id: number }>(),
        'load submitted error': props<{ error: any, id: number }>(),

        'get load status': props<{ loadingId: string, id: number }>(),
        'set load status': props<{ loadingStatus: PLoadingStatus, id: number }>(),
        'get load status error': props<{ error: any, id: number }>(),

        'get summary': props<{ datasetId: string, id: number }>(),
        'set summary': props<{ summary: DataSummary, id: number }>(),
        'get summary error': props<{ error: any, id: number }>(),
        'clear summary': props<{ id: number }>(),

        'update summary': props<{ update: Update<DataSummary> }>(),
        'update annotations': props<{ update: Update<string[][]> }>(),
        'update statistical design': props<{ update: Update<StatisticalDesign> }>(),

        'set annotations': props<{ annotations: string[][], id: number }>(),

        'init statistical design': props<{ id: number }>(),
        'init covariances': props<{ id: number }>(),
        'set statistical design': props<{ statisticalDesign: StatisticalDesign, id: number }>(),
        'set analysis group': props<{ group: string, id: number }>(),
        'set comparison group 1': props<{ group: string, id: number }>(),
        'set comparison group 2': props<{ group: string, id: number }>(),
        'set covariate value': props<{ group: string, value: boolean, id: number }>(),
        'set covariates value': props<{ value: boolean, id: number }>(),
    }
})
