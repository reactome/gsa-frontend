import {Component, input, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {combineLatestWith, distinctUntilChanged, map, Observable, share} from "rxjs";
import {Parameter} from "../../../model/parameter.model";
import {datasetFeature, SampleGroups} from "../../../state/dataset/dataset.selector";
import {datasetActions} from "../../../state/dataset/dataset.actions";

@Component({
  selector: 'gsa-param-dataset',
  templateUrl: './param-dataset.component.html',
  styleUrl: './param-dataset.component.scss',
  standalone: false,
})
export class ParamDatasetComponent implements OnInit {
  readonly datasetId = input.required<number>();

  parameters$: Observable<Parameter[]>;
  sampleGroups$: Observable<SampleGroups>;


  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.sampleGroups$ = this.store.select(datasetFeature.selectSampleGroups(this.datasetId())).pipe(distinctUntilChanged(), share());

    this.parameters$ = this.store.select(datasetFeature.selectSummaryParameters(this.datasetId())).pipe(
      distinctUntilChanged(),
      share(),
      combineLatestWith(this.sampleGroups$),
      map(([parameters, sampleGroups]) => parameters
        .filter(param => param.scope === 'dataset')
        .map(param => ({
          ...param,
          values: param.name === 'sample_groups' ? Object.keys(sampleGroups) : param.values
        }) as Parameter)
      ),
    );

  }


  updateParam(param: Parameter, parameters: Parameter[]) {
    parameters = parameters.map(srcParam => srcParam.name === param.name ? param : srcParam);
    this.store.dispatch(datasetActions.setSummaryParameters({id: this.datasetId(), parameters}))
  }
}
