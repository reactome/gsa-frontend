import {Component, Input, OnInit} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {Method} from "../../state/method/method.state";
import {Store} from "@ngrx/store";
import {methodActions} from "../../state/method/method.action";
import {map, Observable} from "rxjs";
import {methodFeature} from "../../state/method/method.selector";
import {parameterFeature} from "../../state/parameter/parameter.selector";
import {Parameter} from "../../state/parameter/parameter.state";
import {parameterActions} from "../../state/parameter/parameter.action";

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit {
  @Input() method: Method;
  selected$ = this.store.select(methodFeature.selectSelectedMethodName).pipe(map(name => name === this.method.name));
  parameters$: Observable<Parameter[]>;

  ngOnInit(): void {
    this.parameters$ = this.store.select(parameterFeature.selectParameters(this.method.parameterIds)).pipe(
      map(params => params.filter(p => p !== undefined && p.scope !== 'common') as Parameter[])
    );
  }

  constructor(private scrollService: ScrollService, private store: Store) {
  }

  selectMethod() {
    // this.analysisMethodService.selectedMethod = this.method;
    this.store.dispatch(methodActions.select({method: this.method}))
  }

  setToDefault(parameters: Parameter[]) {
    this.store.dispatch(parameterActions.reset({parameters}))
  }

  updateScroll() {
    setTimeout(() => this.scrollService.triggerResize(), 120);
  }
}
