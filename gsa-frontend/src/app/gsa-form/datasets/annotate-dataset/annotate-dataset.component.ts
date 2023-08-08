import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Settings} from "../../model/table.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Observable} from "rxjs";
import {PDataset} from "../../state/dataset/dataset.state";
import {Store} from "@ngrx/store";
import {datasetFeature} from "../../state/dataset/dataset.selector";
import {datasetActions} from "../../state/dataset/dataset.actions";


@Component({
    selector: 'gsa-annotate-dataset',
    templateUrl: './annotate-dataset.component.html',
    styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {
    @ViewChild('hiddenText') textEl: ElementRef;
    @Input() datasetId: number;
    @Output() annotations = new EventEmitter<string[][]>;
    dataset$: Observable<PDataset | undefined>
    annotateDataStep: FormGroup;
    tableSettings: Settings;
    screenIsSmall: boolean = false;
    renameWidth: number = 100;

    constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver, private store: Store) {
        this.annotateDataStep = this.formBuilder.group({
            address: ['', Validators.required]
        });
    }


    ngOnInit() {
        // this.tableSettings = {
        //   columns: this.dataset.table!.columns,
        //   rows: this.dataset.table!.rows,
        //   data: this.dataset.table!.dataset,
        //   renameRows: false,
        //   showRows: true,
        //   addColumnButton: true
        // };

        this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId));
        this.responsive.observe(Breakpoints.Small).subscribe(result => this.screenIsSmall = result.matches);
        this.resize()
    }

    resize() {
        // setTimeout(() => this.renameWidth = Math.max(100, this.textEl.nativeElement.offsetWidth));
    }

    updateTitle(value: string) {
        this.store.dispatch(datasetActions.updateSummary({
            update: {
                id: this.datasetId,
                changes: {
                    title: value
                }
            }
        }))
    }
}





