import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Settings} from "../../model/table.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Observable} from "rxjs";
import {PDataset} from "../../state/dataset/dataset.state";
import {Store} from "@ngrx/store";
import {datasetActions} from "../../state/dataset/dataset.actions";
import {Subset} from "../../model/utils.model";
import {datasetFeature} from "../../state/dataset/dataset.selector";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {

  @Input() datasetId: number;
  dataset$: Observable<PDataset | undefined>
  annotateDataStep: FormGroup;
  tableSettings: Subset<Settings>;
  screenIsSmall: boolean = false;

  constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver, private store: Store) {
    this.annotateDataStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.tableSettings = {
      renameRows: false,
      addRow: false
    };
    this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId));
    this.responsive.observe(Breakpoints.Small).subscribe(result => this.screenIsSmall = result.matches);
  }

  onTableUpdate(table: string[][]) {
    this.store.dispatch(datasetActions.setAnnotations({annotations: table, id: this.datasetId}))
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

  protected readonly datasetActions = datasetActions;
}





