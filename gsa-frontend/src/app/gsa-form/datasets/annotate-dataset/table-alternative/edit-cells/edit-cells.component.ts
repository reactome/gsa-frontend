import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {tableFeature} from "../../../../utilities/table/state/table.selector";
import {Store} from "@ngrx/store";
import {combineLatestWith, EMPTY, map, Observable, switchMap} from "rxjs";
import {DropdownComponent} from "../../../../utilities/dropdown/dropdown.component";
import {transpose} from "../../../../utilities/table/state/table.util";
import {Settings} from "../../../../model/table.model";
import {Subset} from "../../../../model/utils.model";

@Component({
    selector: 'gsa-edit-cells',
    templateUrl: './edit-cells.component.html',
    styleUrls: ['./edit-cells.component.scss']
})
export class EditCellsComponent implements OnInit, AfterViewInit {
    cellStep: FormGroup;
    chosenCol: string;
    columnNames$ = this.store.select(tableFeature.selectColNames);
    rowNames$ = this.store.select(tableFeature.selectRowNames);
    data$: Observable<string[][]> = EMPTY;
    @ViewChild('choice') dropdown: DropdownComponent;
    @Input() tableSettings: Subset<Settings>;

    constructor(private formBuilder: FormBuilder, private store: Store) {
        this.cellStep = this.formBuilder.group({
            address: ['', Validators.required]
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.data$ = this.dropdown.valueChange.pipe(
            switchMap(name => this.store.select(tableFeature.selectColumn({name, includeName: true}))),
            map(cells => cells.map(cell => cell.value)),
            combineLatestWith(this.rowNames$),
            map(([column, rowNames]) => transpose([['', ...rowNames], column]))
        )
    }


}
