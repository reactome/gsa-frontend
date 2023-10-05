import {Mapper} from "./utils.model";

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

export interface Settings extends Mapper<boolean | string>{
  renameCols: boolean;
  renameRows: boolean;
  changeCells: boolean;
  addColumn: boolean;
  addRow: boolean;
  showCols: boolean;
  showRows: boolean;

  uploadButton: 'icon' | 'text' | false;
  downloadButton: 'icon' | 'text' | false;
}






