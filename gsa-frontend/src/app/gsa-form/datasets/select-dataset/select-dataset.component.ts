import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {SearchLibraryDataset} from "../../model/dataset-library";
import {PDatasetSource} from "../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {datasetSourceActions} from "../../state/dataset-source/dataset-source.action";
import {datasetSourceFeature} from "../../state/dataset-source/dataset-source.selector";

@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss']
})
export class SelectDatasetComponent implements OnInit {
  @Input() datasetId: number;
  exampleSources$: Observable<PDatasetSource[]> = this.store.select(datasetSourceFeature.selectBySource('Example'));
  externalSources$: Observable<PDatasetSource[]>= this.store.select(datasetSourceFeature.selectBySource('External'));
  localSources$: Observable<PDatasetSource[]>= this.store.select(datasetSourceFeature.selectBySource('Local'));
  selectDatasetStep: FormGroup;
  librarySearchData: SearchLibraryDataset;


  constructor(
    private formBuilder: FormBuilder, public store: Store,  private responsive: BreakpointObserver) {
    this.selectDatasetStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.store.dispatch(datasetSourceActions.loadLocals());
    this.store.dispatch(datasetSourceActions.loadExamples());
    this.store.dispatch(datasetSourceActions.loadExternal());

    this.librarySearchData = {
      page: 1,
      pageCount: 10,
      title: ""
    };
  }
}

