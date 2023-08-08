import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {exhaustMap, map} from "rxjs";
import {TableActions} from "./table.action";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {TableOrder} from "./table.util";

@Injectable()
export class TableEffects {
    importFile = createEffect(() => this.actions$.pipe(
            ofType(TableActions.importFile),
            exhaustMap(({file}) => fromPromise(file.text()).pipe(
                map(content => {
                    return TableActions.import({
                        table: content.split('\n').map(line => line.split((file.type == "text/csv") ? "," : "\t")),
                        hasRowNames: true,
                        hasColNames: true,
                        order: TableOrder.ROW_BY_ROW
                    })
                })))
        )
    )


    constructor(private actions$: Actions) {
    }
}
