export class CellInfo {
  value: any
  x : number
  y : number
  coordinate : DOMRect

  constructor(value?: any, x? : number, y? : number, coord? : DOMRect) {
    this.x = x ?? 0
    this.y = y ?? 0
    this.value = value ?? ''
    this.coordinate = coord ?? new DOMRect()
  }
}

export interface Settings {
  columns: string[];
  rows: string[];
  data: CellInfo[][];
  renameCols?: boolean;
  renameRows?: boolean;
  changeCells?: boolean;
  addColumnButton?: boolean;
  showCols?: boolean;
  showRows?: boolean;
}






