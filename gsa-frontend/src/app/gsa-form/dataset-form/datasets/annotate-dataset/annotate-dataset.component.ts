import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {filter, map, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {PDataset} from "../../../state/dataset/dataset.state";
import {Subset} from "../../../model/utils.model";
import {datasetFeature} from "../../../state/dataset/dataset.selector";
import {datasetActions} from "../../../state/dataset/dataset.actions";
import {isDefined} from "../../../utilities/utils";
import {Settings} from "reactome-table";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {

  @Input() datasetId: number;
  dataset$: Observable<PDataset | undefined>
  annotations$ : Observable<string[][]>
  annotateDataStep: FormGroup;
  tableSettings: Subset<Settings>;
  screenIsSmall: boolean = false;

  isRibo: boolean = false;

  constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver, private store: Store, private cdr: ChangeDetectorRef) {
    this.annotateDataStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.tableSettings = {
      renameRows: false,
      addRow: false
    };
    this.dataset$ = this.store.select(datasetFeature.selectDataset(this.datasetId));  // Data is mocked from the request TODO do NOT merge moch data !!!
    this.annotations$ = this.dataset$.pipe(
      filter(isDefined),
      map(d => d.annotations),
      filter(isDefined),
    );


    this.dataset$.subscribe((dataset: PDataset | undefined) => {
      if(dataset){
        const summary = dataset.summary;
        const type = summary?.type;
        if (type === "ribo_seq") {
          this.isRibo== true;
        }
      }
    })

    if(this.isRibo){
      this.annotateSeqType();
    }
    this.responsive.observe(Breakpoints.Small).subscribe(result => this.screenIsSmall = result.matches);

  }

  onTableUpdate(table: string[][]) {
    console.log("Table", table)
    console.log("onRiboDataAnnotation", table);
    console.log(table.entries())
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

  annotateSeqType(){
    // add Ribo seq annotation if relevant
    let riboDataIdentfiers: string[][] = [];     /// get the identifyer  to perform Seq Type annoation
    this.annotations$.subscribe(data => {
      riboDataIdentfiers = data;
    });
    console.log("Result:", riboDataIdentfiers)
    const modifiedData = riboDataIdentfiers.map((row) => {
      if (row[0] === "") {
        return ["", "SeqType"];
      } else {
        const type = row[0].split("_");
        const seqType = type.length > 1 ? type[1] : "";
        return [row[0], seqType];
      }
    });

    this.onTableUpdate(modifiedData);
  }


  protected readonly datasetActions = datasetActions;
}





