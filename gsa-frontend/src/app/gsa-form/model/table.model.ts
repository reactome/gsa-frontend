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
  rename_cols?: boolean;
  rename_rows?: boolean;
  change_cells?: boolean;
}






