import {initialUndoRedoState, UndoRedoState} from "ngrx-wieder";

export type Coords = { x: number, y: number };

export interface State extends UndoRedoState {
  dataset: Cell[][],
  start: Coords,
  stop: Coords,
  selectedCoords: Coords[],
  hasFocus: boolean
}

export interface Cell {
  value: string,
  selected?: boolean
}

export let EMPTY_CELL: Cell = {value: '', selected: false};

export const initialState: State = {
  dataset: [[EMPTY_CELL]],
  start: {x: 0, y: 0},
  stop: {x: 0, y: 0},
  selectedCoords: [],
  hasFocus: false,
  ...initialUndoRedoState,
};

