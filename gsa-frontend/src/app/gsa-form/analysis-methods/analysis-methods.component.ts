import {Component, OnInit} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {Method} from "../state/method/method.state";
import {methodFeature} from "../state/method/method.selector";
import {methodActions} from "../state/method/method.action";

@UntilDestroy()
@Component({
    selector: 'gsa-analysis-methods',
    templateUrl: './analysis-methods.component.html',
    styleUrls: ['./analysis-methods.component.scss'],
    standalone: false
})
export class AnalysisMethodsComponent implements OnInit {

  methodNames$: Observable<string[]> = this.store.select(methodFeature.selectIds) as Observable<string[]>;
  methods$: Observable<Method[]> = this.store.select(methodFeature.selectAll);

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(methodActions.load())
  }
}

