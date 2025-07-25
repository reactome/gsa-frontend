import {Settings} from "../model/table.model";
import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {height, numberToLetter, pushAll, width} from "../utils/table.util";
import {catchError, EMPTY, exhaustMap, Observable, tap} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {initialUndoRedoState, UndoRedoState} from "ngrx-wieder";

export type Coords = { x: number, y: number };
export type Named = { name: string };

export function isNamed(o: any): o is Named {
  return o.name != undefined
}

export interface TableState extends UndoRedoState {
  dataset: Cell[][],
  maxCols: LocatedValue[],
  start: Coords,
  stop: Coords,
  selectedCoords: Coords[],
  hasFocus: boolean,
  settings: Settings
}

export interface LocatedValue {
  value: string;
  coords: Coords;
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

@Injectable()
export class TableStore extends ComponentStore<TableState> {

  constructor() {
    super({
      dataset: [[EMPTY_CELL]],
      start: {x: 0, y: 0},
      stop: {x: 0, y: 0},
      maxCols: [{value: '', coords: {x: 0, y: 0}}],
      selectedCoords: [],
      hasFocus: false,
      settings: {
        renameCols: true,
        renameRows: true,
        extendOnImport: true,
        rowToBeAdded: 1,
        colToBeAdded: 1,
        changeCells: true,
        addColumn: true,
        addRow: true,
        showRows: true,
        showCols: true,
        deleteRow: true,
        deleteCol: true,
        uploadButton: "text",
        downloadButton: "text"
      },
      ...initialUndoRedoState,
    });
  }

// Readers (Selectors)

  readonly data$ = this.select(state => state.dataset);
  readonly start$ = this.select(state => state.start);
  readonly stop$ = this.select(state => state.stop);
  readonly settings$ = this.select(state => state.settings);
  readonly hasFocus$ = this.select(state => state.hasFocus);
  readonly maxColumns$ = this.select(state => state.maxCols);

  readonly rawData$ = this.select(state => state.dataset.map(row => row.map(cell => cell.value)));
  readonly value$ = this.select(state => state.dataset[state.start.y][state.start.x].value);
  readonly colNames$ = this.select(state => state.dataset[0].slice(1).map(cell => cell.value));
  readonly rowNames$ = this.select(state => state.dataset.slice(1).map(cell => cell[0].value));
  readonly range$ = this.select(state => {
    const range = Ranges.minMax(state.start, state.stop)
    return state.dataset
      .slice(range.y.min, range.y.max + 1)
      .map(row => row
        .slice(range.x.min, range.x.max + 1)
        .map(cell => cell.value)
      )
  });

  readonly column$ = (props: ({ index: number } | Named) & { includeName?: boolean }) => this.select(state => {
    const x = isNamed(props) ? state.dataset[0].findIndex(cell => cell.value == props.name) : props.index;
    if (x < 1) return [];
    return state.dataset.map(row => row[x]).slice(props.includeName ? 0 : 1)
  })

  readonly row$ = (props: ({ index: number } | Named) & { includeName?: boolean }) => this.select(state => {
    const y = isNamed(props) ? state.dataset.findIndex(cell => cell[0].value == props.name) : props.index;
    if (y < 1) return [];
    return state.dataset[y].slice(props.includeName ? 0 : 1)
  })


  // Writers (Reducers)

  readonly down = this.updater((state, {shift}: { shift: boolean }) => {
    const limits = Ranges.limits(state);
    const start = {...state.start};
    if (state.start.y !== limits.y.max) {
      start.y++;
    } else {
      start.y = limits.y.min;
      start.x = (state.start.x !== limits.x.max) ? state.start.x + 1 : limits.x.min;
    }
    const stop = !shift ? {...start} : state.stop;
    return Cells.select({...state, start, stop});
  })

  readonly up = this.updater((state, {shift}: { shift: boolean }) => {
    const limits = Ranges.limits(state);
    const start = {...state.start};
    if (start.y !== limits.y.min) {
      start.y--;
    } else {
      start.y = limits.y.max;
      start.x = (start.x !== limits.x.min) ? start.x - 1 : limits.x.max;
    }
    const stop = !shift ? {...start} : state.stop;
    return Cells.select({...state, start, stop});
  })

  readonly left = this.updater((state, {shift}: { shift: boolean }) => {
    const limits = Ranges.limits(state);
    const start = {...state.start};
    if (start.x !== limits.x.min) {
      start.x--;
    } else {
      start.x = limits.x.max;
      start.y = (start.y !== limits.y.min) ? start.y - 1 : limits.y.max;
    }
    const stop = !shift ? {...start} : state.stop;
    return Cells.select({...state, start, stop});
  })

  readonly right = this.updater((state, {shift}: { shift: boolean }) => {
    const limits = Ranges.limits(state);
    const start = {...state.start};
    if (start.x !== limits.x.max) {
      start.x++;
    } else {
      start.x = limits.x.min;
      start.y = (start.y !== limits.y.max) ? start.y + 1 : limits.y.min;
    }
    const stop = !shift ? {...start} : state.stop;
    return Cells.select({...state, start, stop});
  })

  readonly write = this.updater((state, {value}: { value: string }) => {
    if (Ranges.equals({x: 0, y: 0}, state.start)) return state
    if (state.start)
      state.hasFocus = true;
    const x = state.start.x;
    const y = state.start.y;
    const cell = state.dataset[y][x];

    state.dataset[y][x] = {...cell, value};
    state.start = {...state.start};
    const maxInColumn = state.maxCols[x];

    if (Ranges.equals(state.start, maxInColumn.coords)) {
      if (value.length > maxInColumn.value.length) state.maxCols[x] = {value, coords: state.start} // Increasing maximum cell
      else state.maxCols[x] = Ranges.findMaximumOfColumn(state, x)// Decreasing maximum cell ==> searching for new maximum
    } else if (value.length > maxInColumn.value.length) state.maxCols[x] = {value, coords: state.start}

    return {...state, dataset: [...state.dataset]};
  })

  readonly focus = this.updater((state) => Cells.select({
    ...state,
    hasFocus: true
  }));

  readonly focusFirst = this.updater((state) => {
    state.hasFocus = true;
    state.start = {x: 1, y: 1};
    state.stop = state.start;
    return Cells.select(state);
  });
  readonly focusLast = this.updater((state) => {
    state.hasFocus = true;
    state.start = {x: width(state.dataset), y: height(state.dataset)};
    state.stop = state.start;
    return Cells.select(state);
  });

  readonly blur = this.updater((state) => Cells.select({
    ...state,
    hasFocus: false
  }));

  readonly deselect = this.updater((state) => {
    state.hasFocus = false;
    state.start = {x: 1, y: 1};
    state.stop = state.start;
    return Cells.select(state);
  });

  readonly selectCell = this.updater((state, {coords, shift}: { coords: Coords, shift?: boolean }) => {
    const origin = Ranges.origin(state);
    if (coords.x < origin.x || coords.y < origin.y) return state;
    state.hasFocus = true;
    state.start = coords;
    if (!shift) state.stop = state.start;
    return Cells.select(state);
  });

  readonly selectRange = this.updater((state, {start, stop}: { start?: Coords, stop?: Coords }) => {
    const origin = Ranges.origin(state);
    if (start && start.x >= origin.x && start.y >= origin.y) state.start = start;
    if (stop && stop.x >= origin.x && stop.y >= origin.y) state.stop = stop;
    state.hasFocus = true;
    return Cells.select(state);
  });

  readonly delete = this.updater((state) => {
    const range = Ranges.minMax(state.start, state.stop);
    const colsToGetMax = new Set<number>()
    for (let y = range.y.min; y <= range.y.max; y++) {
      for (let x = range.x.min; x <= range.x.max; x++) {
        state.dataset[y][x].value = '';
        if (Ranges.equals(state.maxCols[x].coords, {x,y})) colsToGetMax.add(x);
      }
    }
    colsToGetMax.forEach(x => state.maxCols[x] = Ranges.findMaximumOfColumn(state, x));
    return {...state, dataset: [...state.dataset], maxCols: [...state.maxCols]};
  });

  readonly paste = this.updater((state, {table}: { table: string[][] }) => {
    const range = Ranges.minMax(state.start, state.stop);
    const colsToGetMax = new Set<number>()

    for (let yFrom = 0; yFrom < table.length; yFrom++) {
      const yTo = range.y.min + yFrom;
      for (let xFrom = 0; xFrom < table[yFrom].length; xFrom++) {
        const xTo = range.x.min + xFrom;
        if (state.dataset[yTo] && state.dataset[yTo][xTo]){
          state.dataset[yTo][xTo].value = table[yFrom][xFrom];
          if (Ranges.equals(state.maxCols[xTo].coords, {x: xTo, y: yTo})) colsToGetMax.add(xTo);
        }
      }
    }
    colsToGetMax.forEach(x => state.maxCols[x] = Ranges.findMaximumOfColumn(state, x));
    state.start = {x: range.x.min, y: range.y.min};
    state.stop = Ranges.limitCoords({x: range.x.min + width(table), y: range.y.min + height(table)}, state) // Make selection range equal to the pasted region
    return Cells.select({...state, dataset: [...state.dataset], maxCols: [...state.maxCols]});
  });

  readonly clear = this.updater((state) => ({
    ...state,
    start: {x: 0, y: 0},
    stop: {x: 0, y: 0},
    dataset: [[cell()]],
    maxCols: [{value: '', coords: {x: 0, y: 0}}]
  }));

  readonly import = this.updater((state, {table, hasRowNames, hasColNames, fullImport = false}: {
    table: string[][], hasRowNames: boolean, hasColNames: boolean, fullImport?: boolean
  }) => {
    const nameToRowI = new Map(state.dataset.map((row, i) => [row[0].value, i]));
    const nameToColI = new Map(state.dataset[0].map((cell, i) => [cell.value, i]));

    for (let yFrom = 0; yFrom < table.length; yFrom++) {
      let xTo, yTo: number;
      let rowName = table[yFrom][0];
      if (hasRowNames && nameToRowI.has(rowName)) { // Row already present
        yTo = nameToRowI.get(rowName) as number;
      } else if (fullImport || state.settings.addRow) { // New row to add
        yTo = state.dataset.push(state.dataset[0].map(() => cell())) - 1;
        nameToRowI.set(rowName, yTo);
      } else continue; // skip row since not present and cannot be added

      for (let xFrom = 0; xFrom < table[0].length; xFrom++) {
        const colName = table[0][xFrom];
        if (hasColNames && nameToColI.has(colName)) { // Column already present
          xTo = nameToColI.get(colName) as number;
        } else if (fullImport || state.settings.addColumn) { // New column to add
          xTo = pushAll(state.dataset, cell()) - 1;
          nameToColI.set(colName, xTo);
          state.maxCols.push({value: colName, coords: {x: xTo, y: yTo}});
        } else continue; // skip column since not present and cannot be added

        const value = table[yFrom][xFrom];
        state.dataset[yTo][xTo].value = value;
        if (value.length > state.maxCols[xTo].value.length) state.maxCols[xTo] = {value, coords: {x: xTo, y: yTo}};
      }
    }

    return Cells.select({...state, dataset: [...state.dataset]});
  });

  readonly addColumn = this.updater((state) => {
    const x = pushAll(state.dataset, cell()) - 1;
    const value = numberToLetter(x);
    const coords = {x, y: 0};

    state.dataset[0][x].value = value;
    state.maxCols.push({value, coords})
    state.start = coords;
    state.stop = state.start;
    state.hasFocus = true;
    return Cells.select({...state, dataset: [...state.dataset]});
  });

  readonly addRow = this.updater((state) => {
    const y = state.dataset.push(state.dataset[0].map(() => cell())) - 1;
    state.dataset[y][0].value = '' + y;
    state.start = {x: 0, y};
    state.stop = state.start;
    state.hasFocus = true;
    return Cells.select({...state, dataset: [...state.dataset]});
  });

  readonly deleteColumn = this.updater((state, props: { x: number } | Named) => {
    const x = isNamed(props) ? state.dataset[0].findIndex(cell => cell.value === props.name) : props.x;
    if (x < 1) return state;
    state.dataset.forEach(row => row.splice(x, 1))
    state.maxCols.splice(x, 1)
    state.maxCols = [...state.maxCols];
    state.start = {x: 0, y: 0};
    state.stop = state.start;
    state.hasFocus = false;
    return Cells.select({...state, dataset: [...state.dataset]});
  });
  readonly deleteRow = this.updater((state, props: { y: number } | Named) => {
    const y = isNamed(props) ? state.dataset.map(row => row[0]).findIndex(cell => cell.value === props.name) : props.y;
    if (y < 1) return state;
    state.dataset.splice(y, 1);
    state.start = {x: 0, y: 0};
    state.stop = state.start;
    state.hasFocus = false;

    state.maxCols
      .filter(max => max.coords.y === y) // If we have deleted the row containing the max
      .forEach(max => state.maxCols[max.coords.x] = Ranges.findMaximumOfColumn(state, max.coords.x)) // We find the new one

    return Cells.select({...state, dataset: [...state.dataset], maxCols: [...state.maxCols]});
  });

  readonly setting = this.updater((state, {setting, value}: { setting: keyof Settings, value: boolean }) => ({
    ...state,
    settings: {
      ...state.settings,
      [setting]: value
    }
  }));

  readonly settings = this.updater((state, {settings}: { settings: Partial<Settings> }) => ({
    ...state,
    settings: {
      ...state.settings,
      ...settings as Settings,
    },
  }));


  // Effects
  readonly importFileContent = this.effect((file$: Observable<{ content: string, type: 'csv' | 'tsv' }>) => {
    return file$.pipe(
      tap({
        next: ({content, type}) => this.import({
          table: content.split('\n').map(line => line.split((type == "csv") ? "," : "\t")),
          hasRowNames: true,
          hasColNames: true
        }),
        error: (e) => console.error(e)
      }),
      catchError(() => EMPTY))
  })

  readonly importFile = this.effect((file$: Observable<File>) => {
    return file$.pipe(
      exhaustMap((file) => fromPromise(file.text()).pipe(
        tap(content => this.importFileContent({content, type: file.type === 'text/csv' ? 'csv' : 'tsv'})),
        catchError(() => EMPTY))
      ),
    )
  })
}

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

  export function origin(state: TableState): Coords {
    return {
      x: state.settings.renameRows ? 0 : 1,
      y: state.settings.renameCols ? 0 : 1
    }
  }

  export function equals(a: Coords, b: Coords): boolean {
    return a.x === b.x && a.y === b.y;
  }

  export function limits(state: TableState): Range {
    const origin = Ranges.origin(state);
    return {
      x: {min: origin.x, max: width(state.dataset)},
      y: {min: origin.y, max: height(state.dataset)}
    }
  }

  export function limitRange(range: Range, state: TableState, limits = Ranges.limits(state)): Range {
    return {
      x: {min: limit(range.x.min, limits.x.min, limits.x.max), max: limit(range.x.max, limits.x.min, limits.x.max)},
      y: {min: limit(range.y.min, limits.y.min, limits.y.max), max: limit(range.y.max, limits.y.min, limits.y.max)}
    }
  }

  export function limitCoords(coords: Coords, state: TableState): Coords {
    const {x, y} = origin(state);
    return {
      x: limit(coords.x, x, width(state.dataset)),
      y: limit(coords.y, y, height(state.dataset))
    }
  }

  function limit(value: number, lowerLimit: number, upperLimit: number): number {
    if (value < lowerLimit) return lowerLimit;
    if (value > upperLimit) return upperLimit;
    return value;
  }

  export function column<T>(table: T[][], x: number): T[] {
    return table.map((row: T[]) => row[x]);
  }

  export function findMaximumOfColumn(state: TableState, x: number): LocatedValue {
    return Ranges.column(state.dataset, x).reduce((max, e, y) => e.value.length > max.value.length ? {
        value: e.value,
        coords: {x, y}
      } : max,
      {value: state.dataset[state.start.y][x].value, coords: state.start}
    );
  }
}

namespace Cells {
  export function select(state: TableState): TableState {
    state.selectedCoords.forEach(coords => {
      let cell = state.dataset[coords.y][coords.x];
      if (cell) {
        cell.selected = false;
        cell.visibility = 'visible';
      }
    });
    state.selectedCoords = [];
    if (!state.hasFocus) return state
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

  function selectCell(coords: Coords, state: TableState): Coords {
    state.dataset[coords.y][coords.x].selected = true;
    state.selectedCoords.push(coords);
    return coords;
  }

}




