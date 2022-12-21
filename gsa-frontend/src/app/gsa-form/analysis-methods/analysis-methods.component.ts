import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss']
})
export class AnalysisMethodsComponent implements OnInit {

  analysisMethodStep: FormGroup;
  screenIsXSmall: boolean = false;
  @ViewChild('flyingRename') input: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder, public analysisMethodsService: AnalysisMethodsService, private responsive: BreakpointObserver) {
    this.analysisMethodStep = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.analysisMethodsService.getAnalysisMethods();
    this.responsive.observe(Breakpoints.XSmall)
      .pipe(untilDestroyed(this))
      .subscribe(result => this.screenIsXSmall = result.matches);
  }
}

