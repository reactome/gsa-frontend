import {Component, OnInit, input} from '@angular/core';
import {TableStore} from "../../state/table.store";
import {map, Observable} from "rxjs";


@Component({
    selector: 'reactome-table-upload',
    templateUrl: './upload-table.component.html',
    styleUrls: ['./upload-table.component.scss'],
    standalone: false
})
export class UploadTableComponent implements OnInit {
    readonly tableStore = input.required<TableStore>();

    type$: Observable<false | 'icon' | 'text'>

    constructor() {
    }

    ngOnInit(): void {
      this.type$ = this.tableStore().settings$.pipe(map(s => s.uploadButton))
    }

    uploadFile(input: HTMLInputElement) {
        if (input?.files?.[0]) this.tableStore().importFile(input.files[0])
    }
}
