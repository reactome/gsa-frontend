import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {MethodParameter} from "../model/methods.model";
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {parameterFeature} from "../state/parameter/parameter.selector";
import {Parameter} from "../state/parameter/parameter.state";
import {Method} from "../state/method/method.state";

@Component({
    selector: 'gsa-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
    @Input() method: Method;
    analysisOptionsStep: FormGroup;
    parameters$: Observable<Parameter[]>;

    constructor(private formBuilder: FormBuilder, public analysisMethodsService: AnalysisMethodsService, public store: Store) {
        this.analysisOptionsStep = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        console.log(this.method.parameterIds)
        this.parameters$ = this.store.select(parameterFeature.selectParameters(this.method.parameterIds)).pipe(
            map(params => params.filter(p =>  p.scope === 'common') as MethodParameter[])
        );
    }
}
