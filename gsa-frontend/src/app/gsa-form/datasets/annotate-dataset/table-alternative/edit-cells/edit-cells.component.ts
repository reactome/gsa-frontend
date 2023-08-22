import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {combineLatestWith, EMPTY, map, Observable, switchMap} from "rxjs";
import {DropdownComponent} from "../../../../utilities/dropdown/dropdown.component";
import {transpose} from "../../../../utilities/table/state/table.util";
import {Settings} from "../../../../model/table.model";
import {Subset} from "../../../../model/utils.model";
import {TableStore} from "../../../../utilities/table/state/table.store";

@Component({
    selector: 'gsa-edit-cells',
    templateUrl: './edit-cells.component.html',
    styleUrls: ['./edit-cells.component.scss']
})
export class EditCellsComponent implements OnInit, AfterViewInit {
    cellStep: FormGroup;
    chosenCol: string;
    columnNames$: Observable<string[]>;
    rowNames$: Observable<string[]>;
    data$: Observable<string[][]> = EMPTY;
    @ViewChild('choice') dropdown: DropdownComponent;
    @Input() tableStore: TableStore;
    @Input() tableSettings: Subset<Settings>;

    constructor(private formBuilder: FormBuilder) {
        this.cellStep = this.formBuilder.group({
            address: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.columnNames$ = this.tableStore.colNames$;
        this.rowNames$ = this.tableStore.rowNames$;
    }

    ngAfterViewInit(): void {
        this.data$ = this.dropdown.valueChange.pipe(
            switchMap(name => this.tableStore.column$({name, includeName: true})),
            map(cells => cells.map(cell => cell.value)),
            combineLatestWith(this.rowNames$),
            map(([column, rowNames]) => transpose([['', ...rowNames], column]))
        )
    }


}
