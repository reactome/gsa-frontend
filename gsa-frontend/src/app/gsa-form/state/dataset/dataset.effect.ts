import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, delayWhen, exhaustMap, filter, map, mergeMap, of, switchMap, tap, timer} from "rxjs";
import {datasetActions} from "./dataset.actions";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {TypedAction} from "@ngrx/store/src/models";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LoadingProgressComponent} from "../../datasets/select-dataset/loading-progress/loading-progress.component";
import {TableActions} from "../../utilities/table/state/table.action";
import {TableOrder} from "../../utilities/table/state/table.util";


@Injectable()
export class LoadedDatasetEffects {
    upload = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.upload),
        exhaustMap(({file, typeId}) => this.loadDatasetService.uploadFile(file).pipe(
            map(uploadData => datasetActions.uploadComplete({uploadData, typeId, name: file.name.substring(0, file.name.lastIndexOf("."))})),
            catchError((err) => of(datasetActions.uploadError({error: err})))
        ))
    ))

    load = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.load),
        exhaustMap(({resourceId, parameters}) => this.loadDatasetService.submitLoadDataset(resourceId, parameters).pipe(
            map(loadingId => datasetActions.loadSubmitted({loadingId})),
            catchError((err) => of(datasetActions.loadSubmittedError({error: err})))
        ))
    ))

    loadSubmitted = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.loadSubmitted),
        tap(({loadingId}) => {
            this.dialogRef = this.dialog.open(LoadingProgressComponent, {
                width: '50%',
                height: '50%',
                disableClose: true,
                data: {loadingId}
            });
        }),
        map(({loadingId}) => datasetActions.getLoadStatus({loadingId}))
    ))

    loadStatus = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.getLoadStatus),
        switchMap(({loadingId}) => this.loadDatasetService.getLoadingStatus(loadingId).pipe(
            mergeMap(loadingStatus => {
                const actions: TypedAction<any>[] = [datasetActions.setLoadStatus({loadingStatus})];
                if (loadingStatus.status === "running") actions.push(datasetActions.getLoadStatus({loadingId}));
                else if (loadingStatus.status === "failed") actions.push(datasetActions.getLoadStatusError({error: loadingStatus.reports}));
                return actions
            }),
            delayWhen(action => action.type === '[GSA Dataset] get load status' ? timer(500) : timer(0)),
            catchError((err) => of(datasetActions.loadSubmittedError({error: err})))
        ))
    ))

    loadingToSummary = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.setLoadStatus),
        filter(({loadingStatus}) => loadingStatus.status === 'complete'),
        map(({loadingStatus}) => datasetActions.getSummary({datasetId: loadingStatus.dataset_id!, loadingId: loadingStatus.id}))
    ))

    getSummary = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.getSummary),
        exhaustMap(({loadingId, datasetId}) => this.loadDatasetService.getSummary(datasetId).pipe(
            map(summary => datasetActions.setSummary({summary, loadingId})),
            catchError((err) => of(datasetActions.loadSubmittedError({error: err}))),
            tap(() => setTimeout(() => this.dialogRef.close(), 500))
        ))
    ))


    summaryToAnnotate = createEffect(() => this.actions$.pipe(
        ofType(datasetActions.setSummary),
        map(({summary}) => {
            const table: string[][] = (!summary.sample_metadata) ?
                [[''], ...summary.sample_ids.map(id => [id])] :
                [
                    ['', ...summary.sample_metadata.map(col => col.name)],
                    ...summary.sample_ids.map((id, i) => [id, ...summary.sample_metadata!.map(column => column.values[i])])
                ]
            return TableActions.import({table, hasColNames: true, hasRowNames: true, order: TableOrder.ROW_BY_ROW})
        })
    ))


    dialogRef: MatDialogRef<LoadingProgressComponent>;

    constructor(
        private actions$: Actions,
        private dialog: MatDialog,
        private loadDatasetService: LoadDatasetService
    ) {
    }
}
