import {undoRedo} from "ngrx-wieder";
import {cell, Cell, Coords, initialState, State} from "./table.state";
import {ActionReducer, on} from "@ngrx/store";
import {isNamed, TableActions} from "./table.action";
import {height, numberToLetter, pushAll, TableOrder, width} from "./table.util";

const {createUndoRedoReducer} = undoRedo({
    allowedActionTypes: []
})

export const reducer: ActionReducer<State> = createUndoRedoReducer(
    initialState,
    on(TableActions.down, (state, {shift}) => {
        if (state.start.y !== height(state.dataset)) {
            state.start.y++;
        } else {
            state.start.y = 0;
            state.start.x = (state.start.x !== width(state.dataset)) ? state.start.x + 1 : 0;
        }
        if (!shift) state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.up, (state, {shift}) => {
        if (state.start.y !== 0) {
            state.start.y--;
        } else {
            state.start.y = height(state.dataset);
            state.start.x = (state.start.x !== 0) ? state.start.x - 1 : width(state.dataset);
        }
        if (!shift) state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.left, (state, {shift}) => {
        if (state.start.x !== 0) {
            state.start.x--;
        } else {
            state.start.x = width(state.dataset);
            state.start.y = (state.start.y !== 0) ? state.start.y - 1 : height(state.dataset);
        }
        if (!shift) state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.right, (state, {shift}) => {
        if (state.start.x !== width(state.dataset)) {
            state.start.x++;
        } else {
            state.start.x = 0;
            state.start.y = (state.start.y !== height(state.dataset)) ? state.start.y + 1 : 0;
        }
        if (!shift) state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.write, (state, {value}) => {
        state.hasFocus = true;
        let element = state.dataset[state.start.y][state.start.x];
        state.dataset[state.start.y][state.start.x] = {...element, value}
        return state;
    }),
    on(TableActions.focus, (state) => {
        state.hasFocus = true;
        return state;
    }),
    on(TableActions.focusFirst, (state) => {
        state.hasFocus = true;
        state.start = {x: 1, y: 1};
        state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.focusLast, (state) => {
        state.hasFocus = true;
        state.start = {
            x: state.dataset[0].length - 1,
            y: state.dataset.length - 1
        };
        state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.blur, (state) => {
        state.hasFocus = false;
        return state;
    }),
    on(TableActions.deselect, (state) => {
        state.hasFocus = false;
        state.start = {x: 0, y: 0};
        state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.select, (state, {coords, shift}) => {
        state.hasFocus = true;
        state.start = coords;
        if (!shift) state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.selectRange, (state, {start, stop}) => {
        state.hasFocus = true;
        if (start) state.start = start;
        if (stop) state.stop = stop;
        return Cells.select(state);
    }),
    on(TableActions.delete, (state) => {
        for (let x = state.start.x; x <= state.stop.x; x++) {
            for (let y = state.start.y; y <= state.stop.y; y++) {
                state.dataset[y][x].value = '';
            }
        }
        return state;
    }),
    on(TableActions.paste, (state, {table}) => {
        const range = Ranges.minMax(state.start, state.stop);
        for (let y = 0; y < table.length; y++) {
            for (let x = 0; x < table[y].length; x++) {
                if (state.dataset[range.y.min + y] && state.dataset[range.y.min + y][range.x.min + x])
                    state.dataset[range.y.min + y][range.x.min + x].value = table[y][x];
            }
        }
        state.start = {x: range.x.min, y: range.y.min};
        state.stop = Ranges.limitCoords({x: range.x.min + width(table), y: range.y.min + height(table)}, state) // Make selection range equal to the pasted region
        Cells.select(state);
        return state;
    }),
    on(TableActions.import, (state, {table, hasColNames, hasRowNames, order = TableOrder.COLUMN_BY_COLUMN}) => {
        const nameToRowI = new Map(state.dataset.map((row, i) => [row[0].value, i]));
        const nameToColI = new Map(state.dataset[0].map((cell, i) => [cell.value, i]));

        switch (order) {
            case TableOrder.ROW_BY_ROW:
                for (let yFrom = 0; yFrom < table.length; yFrom++) {
                    let xTo, yTo: number;
                    let rowName = table[yFrom][0];
                    if (hasRowNames && nameToRowI.has(rowName)) {
                        yTo = nameToRowI.get(rowName) as number;
                    } else {

                        yTo = state.dataset.push(state.dataset[0].map(() => cell())) - 1;
                        nameToRowI.set(rowName, yTo);
                    }
                    for (let xFrom = 0; xFrom < table[0].length; xFrom++) {
                        const colName = table[0][xFrom];
                        if (hasColNames && nameToColI.has(colName)) {
                            xTo = nameToColI.get(colName) as number;
                        } else {
                            xTo = pushAll(state.dataset, cell()) - 1;
                            nameToColI.set(colName, xTo);
                        }
                        state.dataset[yTo][xTo].value = table[yFrom][xFrom];
                    }
                }
                break;
            case TableOrder.COLUMN_BY_COLUMN:
                // for (let xFrom = 0; xFrom < table.length; xFrom++) {
                //   let xTo, yTo: number;
                //   if (hasColNames && nameToColI.has(table[xFrom][0])) {
                //     xTo = nameToColI.get(table[xFrom][0]) as number;
                //   } else {
                //     xTo = pushAll(state.dataset, {value: ''}) - 1;
                //   }
                //   for (let yFrom = 0; yFrom < table[0].length; yFrom++) {
                //     if (hasRowNames && nameToRowI.has(table[0][yFrom])) {
                //       yTo = nameToRowI.get(table[0][yFrom]) as number;
                //     } else {
                //       yTo = state.dataset[xTo].push({value: ''}) - 1;
                //     }
                //     state.dataset[yTo][xTo].value = table[xFrom][yFrom];
                //   }
                // }
                break;
        }

        return Cells.select(state);
    }),
    on(TableActions.addColumn, (state) => {
        const x = pushAll(state.dataset, cell()) - 1;
        state.dataset[0][x].value = numberToLetter(x);
        state.start = {x, y: 0};
        state.stop = state.start;
        console.log(state)
        state.hasFocus = true;
        return Cells.select(state);
    }),
    on(TableActions.addRow, (state) => {
        const y = state.dataset.push(state.dataset[0].map(() => cell())) - 1;
        state.dataset[y][0].value = '' + (y - 1);
        state.start = {x: 0, y};
        state.stop = state.start;
        state.hasFocus = true;
        return Cells.select(state);
    }),
    on(TableActions.deleteColumn, (state, props) => {
        const x = isNamed(props) ? state.dataset[0].findIndex(cell => cell.value === props.name) : props.x;
        if (x < 1) return state;
        state.dataset.forEach(row => row.splice(x, 1))
        state.start = {x: 0, y: 0};
        state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.deleteRow, (state, props) => {
        const y = isNamed(props) ? state.dataset.map(row => row[0]).findIndex(cell => cell.value === props.name) : props.y;
        if (y < 1) return state;
        state.dataset.splice(y, 1);
        state.start = {x: 0, y: 0};
        state.stop = state.start;
        return Cells.select(state);
    }),
    on(TableActions.setting, (state, {setting, value}) => ({
        ...state,
        settings: {
            ...state.settings,
            [setting]: value
        }
    })),
    on(TableActions.settings, (state, {settings}) => ({
        ...state,
        settings: {
            ...state.settings,
            ...settings
        }
    })),
)


export namespace Ranges {
    type MinMax = { min: number, max: number };
    type Range = { x: MinMax, y: MinMax };

    export function minMax(start: Coords, stop: Coords): Range {
        const [minX, maxX] = [start.x, stop.x].sort((a, b) => a - b);
        const [minY, maxY] = [start.y, stop.y].sort((a, b) => a - b);
        return {
            x: {min: minX, max: maxX},
            y: {min: minY, max: maxY}
        }
    }

    export function limitRange(range: Range, state: State): Range {
        return {
            x: {min: limit(range.x.min, 0, width(state.dataset)), max: limit(range.x.max, 0, width(state.dataset))},
            y: {min: limit(range.y.min, 0, height(state.dataset)), max: limit(range.y.max, 0, height(state.dataset))}
        }
    }

    export function limitCoords(coords: Coords, state: State): Coords {
        return {
            x: limit(coords.x, 0, width(state.dataset)),
            y: limit(coords.y, 0, height(state.dataset))
        }
    }

    function limit(value: number, lowerLimit: number, upperLimit: number): number {
        if (value < lowerLimit) return lowerLimit;
        if (value > upperLimit) return upperLimit;
        return value;
    }
}

namespace Cells {
    export function select(state: State): State {
        state.selectedCoords.forEach(coords => {
            let cell = state.dataset[coords.y][coords.x];
            cell.selected = false;
            cell.visibility = 'visible';
        });
        state.selectedCoords = [];
        const range = Ranges.minMax(state.start, state.stop);
        for (let x = range.x.min; x <= range.x.max; x++) {
            for (let y = range.y.min; y <= range.y.max; y++) {
                selectCell({x, y}, state);
                selectCell({x: 0, y}, state);
            }
            selectCell({x, y: 0}, state);
        }
        let selectedCell = state.dataset[state.start.y][state.start.x];
        if (selectedCell) selectedCell.visibility = 'hidden';
        return state;
    }

    function selectCell(coords: Coords, state: State): Coords {
        // if (!cell) return cell;
        state.dataset[coords.y][coords.x].selected = true;
        state.selectedCoords.push(coords);
        return coords;
    }

}



