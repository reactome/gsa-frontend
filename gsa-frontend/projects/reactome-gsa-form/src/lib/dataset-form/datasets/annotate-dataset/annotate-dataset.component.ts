import {Component, input, OnInit,ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {filter, map, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {PDataset} from "../../../state/dataset/dataset.state";
import {datasetFeature} from "../../../state/dataset/dataset.selector";
import {datasetActions} from "../../../state/dataset/dataset.actions";
import {isDefined} from "../../../utilities/utils";
import {Settings} from "reactome-table";


@Component({
    selector: 'gsa-annotate-dataset',
    templateUrl: './annotate-dataset.component.html',
    styleUrls: ['./annotate-dataset.component.scss'],
    standalone: false
})
export class AnnotateDatasetComponent implements OnInit {

  readonly datasetId = input.required<number>();
  dataset$: Observable<PDataset | undefined>
  annotations$ : Observable<string[][]>
  annotateDataStep: FormGroup;
  tableSettings: Partial<Settings>;
  screenIsSmall: boolean = false;
  isRibo: boolean = false;

  constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver, private store: Store) {
    this.annotateDataStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.tableSettings = {
      renameRows: false,
      addRow: false,
      deleteRow: false,
      dropReplace: false,
    };
    this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId()));  // Data is mocked from the request TODO do NOT merge moch data !!!

    // check for Ribo dataset for automatic Seqeuencing Type annotation
    this.dataset$.subscribe((dataset: PDataset | undefined) => {
      if(dataset) {
        const summary = dataset.summary;
        const type = summary?.type;
        if (type === "ribo_seq") {
          this.isRibo = true;
        }
      }
    })

    this.annotations$ = this.dataset$.pipe(
      filter(isDefined),
      map(d => d.annotations),
      filter(isDefined)
    );

    this.responsive.observe(Breakpoints.Small).subscribe(result => this.screenIsSmall = result.matches);
  }

  onTableUpdate(table: string[][]) {
    this.store.dispatch(datasetActions.setAnnotations({annotations: table, id: this.datasetId()}))
  }

  updateTitle(value: string) {
    this.store.dispatch(datasetActions.updateSummary({
      update: {
        id: this.datasetId(),
        changes: {
          title: value
        }
      }
    }))
  }

  protected readonly datasetActions = datasetActions;
}
