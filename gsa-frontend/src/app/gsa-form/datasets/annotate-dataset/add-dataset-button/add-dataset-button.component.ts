import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {TableActions} from "../../../utilities/table/state/table.action";


@Component({
    selector: 'gsa-add-dataset-button',
    templateUrl: './add-dataset-button.component.html',
    styleUrls: ['./add-dataset-button.component.scss']
})
export class AddDatasetButtonComponent implements OnInit {
    @Input() icon: boolean;


    constructor(private snackBar: MatSnackBar, private store: Store) {
    }

    ngOnInit(): void {
    }

    uploadFile(input: HTMLInputElement) {
        if (input?.files?.[0]) this.store.dispatch(TableActions.importFile({file: input.files[0]}))
    }
}
