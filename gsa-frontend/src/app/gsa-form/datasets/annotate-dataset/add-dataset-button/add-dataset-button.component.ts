import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TableStore} from "../../../utilities/table/state/table.store";


@Component({
    selector: 'gsa-add-dataset-button',
    templateUrl: './add-dataset-button.component.html',
    styleUrls: ['./add-dataset-button.component.scss']
})
export class AddDatasetButtonComponent implements OnInit {
    @Input() icon: boolean;
    @Input() tableStore: TableStore;


    constructor(private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
    }

    uploadFile(input: HTMLInputElement) {
        if (input?.files?.[0]) this.tableStore.importFile(input.files[0])
    }
}
