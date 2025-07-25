import {Component, OnInit, input} from '@angular/core';
import {first, map, Observable} from "rxjs";
import {TableStore} from "../../state/table.store";

@Component({
    selector: 'reactome-table-download',
    templateUrl: './download-table.component.html',
    styleUrls: ['./download-table.component.scss'],
    standalone: false
})
export class DownloadTableComponent implements OnInit {
  readonly name = input.required<string>();
  readonly tableStore = input.required<TableStore>();

  type$: Observable<false | 'icon' | 'text'>

  constructor() {
  }

  ngOnInit(): void {
    this.type$ = this.tableStore().settings$.pipe(map(s => s.downloadButton))
  }


  saveAFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = `${this.name()}.csv`; // the file name
    this.tableStore().rawData$.pipe(first()).subscribe(
      table => {
        dlink.href = encodeURI('data:text/csv;charset=utf-8,' + table.map(row => row.join(", ")).join("\n"));
        dlink.click(); // this will trigger the dialog window
        dlink.remove();
      }
    )
  }

}
