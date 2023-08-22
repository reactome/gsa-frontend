import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {Method} from "../state/method/method.state";
import {methodFeature} from "../state/method/method.selector";
import {methodActions} from "../state/method/method.action";

@UntilDestroy()
@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss']
})
export class AnalysisMethodsComponent implements OnInit {

  methodNames$: Observable<string[]> = this.store.select(methodFeature.selectIds) as Observable<string[]>;
  methods$: Observable<Method[]> = this.store.select(methodFeature.selectAll);
  analysisMethodStep: FormGroup;
  screenIsXSmall: boolean = false;
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, public analysisMethodsService: AnalysisMethodsService, private responsive: BreakpointObserver, private store: Store) {
    this.analysisMethodStep = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(methodActions.load())
    // this.analysisMethodsService.getAnalysisMethods();
    this.responsive.observe(Breakpoints.XSmall)
      .pipe(untilDestroyed(this))
      .subscribe(result => this.screenIsXSmall = result.matches);
  }
}

