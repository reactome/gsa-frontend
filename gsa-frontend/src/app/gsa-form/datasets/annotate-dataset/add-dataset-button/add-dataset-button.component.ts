import {Component, Input, OnInit} from '@angular/core';
import {CellInfo, Settings} from "../../../model/table.model";
import {map, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {MatSnackBar} from "@angular/material/snack-bar";
import {WarningSnackbarComponent} from "./warning-snackbar/warning-snackbar.component";
import {Store} from "@ngrx/store";
import {TableActions} from "../../../utilities/table/state/table.action";


@Component({
    selector: 'gsa-add-dataset-button',
    templateUrl: './add-dataset-button.component.html',
    styleUrls: ['./add-dataset-button.component.scss']
})
export class AddDatasetButtonComponent implements OnInit {
    @Input() tableSettings: Settings;
    @Input() icon: boolean;


    constructor(private snackBar: MatSnackBar, private store: Store) {
    }

    ngOnInit(): void {
    }

    uploadFile(input: HTMLInputElement) {
        if (input?.files?.[0]) this.store.dispatch(TableActions.importFile({file: input.files[0]}))
    }
}
