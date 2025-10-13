import {ModuleWithProviders, NgModule} from '@angular/core';
import {AnalysisMethodsComponent} from "./analysis-methods/analysis-methods.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import {MethodComponent} from './analysis-methods/method/method.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from '@angular/material/input';

import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from "@angular/material/stepper";
import {GsaFormComponent} from './gsa-form.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MethodParameterComponent} from "./utilities/method-parameter/method-parameter.component";
import {DropdownComponent} from './utilities/dropdown/dropdown.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {OptionsComponent} from "./options/options.component";
import {AnalysisComponent} from './analysis/analysis.component';

import {MatDialogModule} from "@angular/material/dialog";
import {ScrollableComponent} from './utilities/scrollable/scrollable.component';
import {StoreModule} from "@ngrx/store";
import {methodFeature} from "./state/method/method.selector";
import {EffectsModule} from "@ngrx/effects";
import {MethodEffects} from "./state/method/method.effect";
import {datasetSourceFeature} from "./state/dataset-source/dataset-source.selector";
import {DatasetSourceEffects} from "./state/dataset-source/dataset-source.effect";
import {datasetFeature} from "./state/dataset/dataset.selector";
import {DatasetEffects} from "./state/dataset/dataset.effect";
import {LetDirective} from "@ngrx/component";
import {analysisFeature} from "./state/analysis/analysis.selector";
import {AnalysisEffects} from "./state/analysis/analysis.effect";
import {SelectDatasetComponent} from "./dataset-form/datasets/select-dataset/select-dataset.component";
import {
  ExampleDataComponent
} from "./dataset-form/datasets/select-dataset/dataset-types/example-data/example-data.component";
import {AnnotateDatasetComponent} from "./dataset-form/datasets/annotate-dataset/annotate-dataset.component";
import {LocalDataComponent} from "./dataset-form/datasets/select-dataset/dataset-types/local-data/local-data.component";
import {
  ExternalDataComponent
} from "./dataset-form/datasets/select-dataset/dataset-types/external-data/external-data.component";
import {
  LoadingProgressComponent
} from "./dataset-form/datasets/select-dataset/loading-progress/loading-progress.component";
import {StatisticalDesignComponent} from "./dataset-form/datasets/statistical-design/statistical-design.component";
import {
  ChangeAnalysisParamsComponent
} from "./dataset-form/datasets/change-analysis-params/change-analysis-params.component";
import {DatasetFormComponent} from "./dataset-form/dataset-form.component";
import {GsaFormRoutingModule} from "./gsa-form-routing.module";
import {CommonModule} from "@angular/common";
import {
  SearchComponent
} from "./dataset-form/datasets/select-dataset/dataset-types/external-data/search/search.component";
import {SearchResultEffects} from "./state/search-result/search-result.effect";
import {searchResultFeature} from "./state/search-result/search-result.selector";
import {SpeciesPipe} from './utilities/species/species.pipe';
import {ReactomeTableModule} from "reactome-table";
import {TourAnchorMatMenuDirective, TourStepTemplateComponent} from "ngx-ui-tour-md-menu";
import {TourComponent} from "./tour/tour.component";
import {config, DEFAULT_GSA_CONFIG, GsaConfig} from "./config/gsa-config";
import {CdkScrollable} from "@angular/cdk/scrolling";


@NgModule({
  declarations: [
    AnalysisMethodsComponent,
    MethodComponent,
    MethodParameterComponent,
    SelectDatasetComponent,
    ExampleDataComponent,
    AnnotateDatasetComponent,
    GsaFormComponent,
    LocalDataComponent,
    ExternalDataComponent,
    LoadingProgressComponent,
    StatisticalDesignComponent,
    DropdownComponent,
    DatasetFormComponent,
    OptionsComponent,
    AnalysisComponent,
    ChangeAnalysisParamsComponent,
    ScrollableComponent,
    SearchComponent,
    SpeciesPipe,
    TourComponent
  ],
  exports: [
    GsaFormComponent
  ],
  imports: [
    GsaFormRoutingModule,
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    ReactiveFormsModule,
    RouterOutlet,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,

    ReactomeTableModule,

    StoreModule.forFeature(methodFeature),
    StoreModule.forFeature(datasetSourceFeature),
    StoreModule.forFeature(datasetFeature),
    StoreModule.forFeature(analysisFeature),
    StoreModule.forFeature(searchResultFeature),
    EffectsModule.forFeature(MethodEffects),
    EffectsModule.forFeature(DatasetSourceEffects),
    EffectsModule.forFeature(DatasetEffects),
    EffectsModule.forFeature(AnalysisEffects),
    EffectsModule.forFeature(SearchResultEffects),
    LetDirective,
    TourAnchorMatMenuDirective,
    TourStepTemplateComponent,
    CdkScrollable,
  ],
  bootstrap: [GsaFormComponent]
})
export class GsaFormModule {

  constructor() {}

  private static configure( c: Partial<GsaConfig>) {
    config.set({...DEFAULT_GSA_CONFIG, ...c});
  }


  static forChild(c: Partial<GsaConfig>): typeof GsaFormModule {
    GsaFormModule.configure(c)
    return GsaFormModule;
  }

  static forRoot(config: Partial<GsaConfig>): ModuleWithProviders<GsaFormModule> {
    GsaFormModule.configure(config);
    return {
      ngModule: GsaFormModule,
      providers: []
    }
  }
}

