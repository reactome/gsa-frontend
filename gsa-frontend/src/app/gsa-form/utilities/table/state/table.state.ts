import {initialUndoRedoState, UndoRedoState} from "ngrx-wieder";
import {Settings} from "../../../model/table.model";

export type Coords = { x: number, y: number };

export interface State extends UndoRedoState {
    dataset: Cell[][],
    start: Coords,
    stop: Coords,
    selectedCoords: Coords[],
    hasFocus: boolean,
    settings: Settings
}

export interface Cell {
    value: string;
    selected: boolean;
    visibility: 'hidden' | 'visible';
}

export let EMPTY_CELL: Cell = {value: '', selected: false, visibility: 'visible'};

export const cell = (value = '', selected = false, visibility: 'hidden' | 'visible' = 'visible'): Cell => ({
    value,
    selected,
    visibility
});

export const initialState: State = {
    dataset: [[EMPTY_CELL]],
    start: {x: 0, y: 0},
    stop: {x: 0, y: 0},
    selectedCoords: [],
    hasFocus: false,
    settings: {
        renameCols: true,
        renameRows: true,
        changeCells: true,
        addColumnButton: true,
        showRows: true,
        showCols: true
    },
    ...initialUndoRedoState,
};

