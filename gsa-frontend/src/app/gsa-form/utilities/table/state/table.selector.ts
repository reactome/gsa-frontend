import {createFeature, createSelector} from "@ngrx/store";
import {Ranges, reducer} from "./table.reducer";
import {TableOrder, transpose} from "./table.util";
import {Cell} from "./table.state";
import {isNamed, Named} from "./table.action";

export const tableFeature = createFeature({
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
        selectColumn: (props: ({ index: number } | Named) & { includeName?: boolean }
        ) => createSelector(selectDataset, (dataset): Cell[] => {
            const x = isNamed(props) ? dataset[0].findIndex(cell => cell.value == props.name) : props.index;
            if (x < 1) return []
            return dataset.map(row => row[x]).slice(props.includeName ? 0 : 1)
        }),

        selectRow: (props: {
            index: number,
            includeName: boolean
        }) => createSelector(selectDataset, (dataset): Cell[] => dataset[props.index].slice(props.includeName ? 0 : 1)),

        selectColNames: createSelector(selectDataset, (dataset) => dataset[0].slice(1).map(cell => cell.value)),
        selectRowNames: createSelector(selectDataset, (dataset) => dataset.slice(1).map(row => row[0].value)),
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
