import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {CellInfo, Settings} from "../../../../model/table.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {tableFeature} from "../../../../utilities/table/state/table.selector";
import {Store} from "@ngrx/store";
import {fromEvent, map, Observable, switchMap} from "rxjs";
import {DropdownComponent} from "../../../../utilities/dropdown/dropdown.component";

@Component({
    selector: 'gsa-edit-cells',
    templateUrl: './edit-cells.component.html',
    styleUrls: ['./edit-cells.component.scss']
})
export class EditCellsComponent implements OnInit, AfterViewInit {
    cellStep: FormGroup;
    chosenCol: string;
    chosenCol$: Observable<string[]>;
    columnNames = this.store.select(tableFeature.selectColNames);
    rowNames = this.store.select(tableFeature.selectRowNames);
    @ViewChild('choice') dropdown: DropdownComponent;

    // column$= this.store.select(tableFeature.selectColumn({name: this.chosenCol, includeName:true }))

    constructor(private formBuilder: FormBuilder, private store: Store) {
        this.cellStep = this.formBuilder.group({
            address: ['', Validators.required]
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.chosenCol$ = this.dropdown.valueChange.pipe(
            switchMap(name => this.store.select(tableFeature.selectColumn({name, includeName: true}))),
            map(cells => [cells.map(cell => cell.value)])
        )
    }


}
