import {createFeature, createSelector} from "@ngrx/store";
import {Ranges, reducer} from "./table.reducer";
import {TableOrder, transpose} from "./table.util";
import {Cell} from "./table.state";
import row from "ag-grid-enterprise/dist/lib/excelExport/files/xml/row";
import cell from "ag-grid-enterprise/dist/lib/excelExport/files/xml/cell";

export const selectors = createFeature({
  name: 'table',
  reducer: reducer,
  extraSelectors: ({selectDataset, selectStart, selectStop}) => ({
    selectData: (order: TableOrder) => createSelector(selectDataset, (dataset) => order === TableOrder.COLUMN_BY_COLUMN ? transpose(dataset) : dataset),
    selectValue: createSelector(
      selectStart, selectDataset,
      (start, dataset): string => {
        return dataset[start.y][start.x].value
      }
    ),
    selectColumn: (props: {
      index: number,
      includeName: boolean
    }) => createSelector(selectDataset, (dataset): Cell[] => dataset.map(col => col[props.index]).slice(props.includeName ? 0 : 1)),

    selectRow: (props: {
      index: number,
      includeName: boolean
    }) => createSelector(selectDataset, (dataset): Cell[] => dataset[props.index].slice(props.includeName ? 0 : 1)),

    selectRange: createSelector(
      selectStart, selectStop, selectDataset,
      (start, stop, dataset): string[][] => {
        const range = Ranges.minMax(start, stop)
        return dataset
          .slice(range.y.min, range.y.max + 1)
          .map(row => row
            .slice(range.x.min, range.x.max + 1)
            .map(cell => cell.value)
          )
      }
    )
  })
})
