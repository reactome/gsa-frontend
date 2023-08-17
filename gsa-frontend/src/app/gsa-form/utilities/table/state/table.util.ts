export enum TableOrder {
  COLUMN_BY_COLUMN,
  ROW_BY_ROW
}

export const width = (table: any[][]) => table[0].length - 1;
export const height = (table: any[][]) => table.length - 1;

export const cp = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

export const transpose = <T>(table: T[][]): T[][] => table[0].map((_, colIndex) => table.map(row => row[colIndex]));
export const findColumnValuesByName = <T>(table: T[][], columnHeader: T): T[] | undefined => transpose(table).find(col => col[0] === columnHeader)?.slice(1);

export const pushAll = <T>(table: T[][], value: T): number => table.reduce((_, col) => col.push(cp(value)), 0);

export const numberToLetter = (nb: number) => {
  let baseChar = ("A").charCodeAt(0), letters = "";

  do {
    nb -= 1;
    letters = String.fromCharCode(baseChar + (nb % 26)) + letters;
    nb = (nb / 26) >> 0; // quick `floor`
  } while (nb > 0);

  return letters;
};
