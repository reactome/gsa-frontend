import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Coords} from "./table.state";
import {TableOrder} from "./table.util";

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

    'focus': emptyProps(),
    'focus first': emptyProps(),
    'focus last': emptyProps(),
    'blur': emptyProps(),

    'deselect': emptyProps(),
    'select': props<{ coords: Coords, shift?: boolean }>(),
    'select range': props<{ start?: Coords, stop?: Coords }>(),

    'import': props<{ table: string[][], hasColNames: boolean, hasRowNames: boolean, order?: TableOrder }>(),
    'paste': props<{ table: string[][], order?: TableOrder }>()
  }
})
