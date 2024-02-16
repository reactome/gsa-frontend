import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {analysisFeature} from "../state/analysis/analysis.selector";
import {formatDate} from "@angular/common";
import {methodFeature} from "../state/method/method.selector";
import {combineLatest, map} from "rxjs";
import {datasetFeature} from "../state/dataset/dataset.selector";
import {isDefined} from "../utilities/utils";


@Component({
  selector: 'gsa-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  analysisStep: FormGroup;
  reportsRequired$ = this.store.select(analysisFeature.selectReportsRequired)
  analysisLoadingStatus$ = this.store.select(analysisFeature.selectAnalysisLoadingStatus)
  reportLoadingStatus$ = this.store.select(analysisFeature.selectReportLoadingStatus)
  result$ = this.store.select(analysisFeature.selectAnalysisResult)

  statusString$ = combineLatest([
    this.store.select(methodFeature.selectSelectedMethod),
    this.store.select(datasetFeature.selectEntities)]
  ).pipe(
      map(([method, datasets]) => {
        const datasetString = Object.values(datasets)
          .filter(isDefined)
          .filter(dataset => dataset.saved)
          .map(dataset => `${dataset.summary?.title} - ${dataset.statisticalDesign?.comparisonGroup1} vs ${dataset.statisticalDesign?.comparisonGroup2}`)
          .join(" | ")
        return `${method?.name} | ${datasetString}`
      })
  )

  @Input() datasetId: number;
  @Output() restart = new EventEmitter<void>()

  constructor(private formBuilder: FormBuilder, public store: Store) {
    this.analysisStep = this.formBuilder.group({
      name: ['', Validators.required]
    });

  }

  ngOnInit(): void {

  }

  goToSelectMethod() {
    this.restart.emit()
  }

  mail(statusString: string | null): string {
    return `mailto:help@reactome.org?subject=${encodeURIComponent(`Reactome GSA failed [${statusString || 'No status'}] on ${formatDate(new Date(), 'short', 'en-US')}`)}`
  }
}
