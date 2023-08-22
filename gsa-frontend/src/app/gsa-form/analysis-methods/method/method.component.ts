import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {Method} from "../../state/method/method.state";
import {Store} from "@ngrx/store";
import {methodActions} from "../../state/method/method.action";
import {filter, map, Observable} from "rxjs";
import {methodFeature} from "../../state/method/method.selector";
import {Parameter} from "../../state/parameter/parameter.state";
import {parameterActions} from "../../state/parameter/parameter.action";
import {isDefined} from "../../utilities/utils";

@Component({
    selector: 'gsa-method',
    templateUrl: './method.component.html',
    styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit, OnChanges {
    @Input() methodName: string;
    selected$ = this.store.select(methodFeature.selectSelectedMethodName).pipe(map(name => name === this.methodName));
    method$: Observable<Method>;
    parameters$: Observable<Parameter[]>;

    ngOnInit(): void {
        // this.parameters$ = this.store.select(parameterFeature.selectParameters(this.method.parameterIds)).pipe(
        //   map(params => params.filter(p => p !== undefined && p.scope !== 'common') as Parameter[])
        // );
        this.method$ = this.store.select(methodFeature.selectMethod(this.methodName)).pipe(filter(isDefined))
        this.parameters$ = this.method$.pipe(map(method => method.parameters.filter(p => p.scope === 'analysis' || p.scope === 'dataset')))
        // this.parameters$ = of(Object.values(this.method.paramMap).filter(p => p && p.scope !== 'common')).pipe(tap(x => console.log(x)));
    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.parameters$ = of(Object.values(this.method.paramMap).filter(p => p && p.scope !== 'common'));
    }


    constructor(private scrollService: ScrollService, private store: Store) {
    }

    selectMethod() {
        // this.analysisMethodService.selectedMethod = this.method;
        this.store.dispatch(methodActions.select({methodName: this.methodName}))
    }

    setToDefault(parameters: Parameter[]) {
        parameters = parameters.map(p => ({...p, value: p.default}));
        this.store.dispatch(methodActions.setSelectedParams({parameters}))
    }

    updateScroll() {
        setTimeout(() => this.scrollService.triggerResize(), 120);
    }

    updateParam(param: Parameter, parameters: Parameter[]) {
        parameters = parameters.map(para => para.name === param.name ? param : para);
        this.store.dispatch(methodActions.setParams({methodName: this.methodName, parameters}));
    }
}
