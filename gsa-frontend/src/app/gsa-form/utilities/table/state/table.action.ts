import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Coords} from "./table.state";
import {TableOrder} from "./table.util";
import {Settings} from "../../../model/table.model";
import {Subset} from "../../../model/utils.model";

export type Named = {name: string};

export function isNamed( o: any): o is Named {
    return o.name != undefined
}

export const TableActions = createActionGroup({
    source: 'Table',
    events: {
        'up': props<{ shift?: boolean }>(),
        'down': props<{ shift?: boolean }>(),
        'right': props<{ shift?: boolean }>(),
        'left': props<{ shift?: boolean }>(),

        'write': props<{ value: string }>(),
        'delete': emptyProps(),

        'add column': emptyProps(),
        'add row': emptyProps(),
        'delete row': props<{ y: number } | Named>(),
        'delete column': props<{ x: number } | Named>(),

        'focus': emptyProps(),
        'focus first': emptyProps(),
        'focus last': emptyProps(),
        'blur': emptyProps(),

        'deselect': emptyProps(),
        'select': props<{ coords: Coords, shift?: boolean }>(),
        'select range': props<{ start?: Coords, stop?: Coords }>(),

        'import file': props<{ file: File }>(),
        'import': props<{ table: string[][], hasColNames: boolean, hasRowNames: boolean, fullImport?: boolean }>(),
        'paste': props<{ table: string[][], order?: TableOrder }>(),

        'setting': props<{ setting: keyof Settings, value: boolean }>(),
        'settings': props<{ settings: Subset<Settings> }>()
    }
})


