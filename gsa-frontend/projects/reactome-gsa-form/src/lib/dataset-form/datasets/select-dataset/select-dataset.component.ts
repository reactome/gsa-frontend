import {Component, OnChanges, OnInit, input, effect, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {SearchLibraryDataset} from "../../../model/dataset-library";
import {PDatasetSource} from "../../../state/dataset-source/dataset-source.state";
import {Store} from "@ngrx/store";
import {datasetSourceActions} from "../../../state/dataset-source/dataset-source.action";
import {datasetSourceFeature} from "../../../state/dataset-source/dataset-source.selector";
import {Method} from "../../../state/method/method.state";


@Component({
  selector: 'gsa-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDatasetComponent implements OnInit {
  readonly datasetId = input.required<number>();
  readonly method = input.required<Method>();

  exampleSources$: Observable<PDatasetSource[]>
  externalSources$: Observable<PDatasetSource[]>
  localSources$: Observable<PDatasetSource[]>

  selectDatasetStep: FormGroup;
  librarySearchData: SearchLibraryDataset;

  constructor(
    private formBuilder: FormBuilder, public store: Store, private responsive: BreakpointObserver) {
    this.selectDatasetStep = this.formBuilder.group({
      address: ['', Validators.required]
    });

    effect(() => {
      console.log('method changed: ', this.method(), ' | ', this.method().name, ' | ', this.method().name.split(' ').join(''))
      this.localSources$ = this.store.select(datasetSourceFeature.selectBySource('Local', this.method()));
      this.externalSources$ = this.store.select(datasetSourceFeature.selectBySource('External', this.method()));
      this.exampleSources$ = this.store.select(datasetSourceFeature.selectBySource('Example', this.method()))
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

