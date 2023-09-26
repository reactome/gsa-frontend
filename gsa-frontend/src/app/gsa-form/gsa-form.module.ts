import {NgModule} from '@angular/core';
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
import {TableModule} from "./utilities/table/table.module";
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {StoreModule} from "@ngrx/store";
import {methodFeature} from "./state/method/method.selector";
import {EffectsModule} from "@ngrx/effects";
import {MethodEffects} from "./state/method/method.effect";
import {datasetSourceFeature} from "./state/dataset-source/dataset-source.selector";
import {DatasetSourceEffects} from "./state/dataset-source/dataset-source.effect";
import {datasetFeature} from "./state/dataset/dataset.selector";
import {DatasetEffects} from "./state/dataset/dataset.effect";
import {LetModule} from "@ngrx/component";
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
  AddDatasetButtonComponent
} from "./dataset-form/datasets/annotate-dataset/add-dataset-button/add-dataset-button.component";
import {
  ChangeAnalysisParamsComponent
} from "./dataset-form/datasets/change-analysis-params/change-analysis-params.component";
import {
  SaveDatasetButtonComponent
} from "./dataset-form/datasets/annotate-dataset/save-dataset-button/save-dataset-button.component";
import {
  WarningSnackbarComponent
} from "./dataset-form/datasets/annotate-dataset/add-dataset-button/warning-snackbar/warning-snackbar.component";
import {DatasetFormComponent} from "./dataset-form/dataset-form.component";
import {GsaFormRoutingModule} from "./gsa-form-routing.module";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AnalysisMethodsComponent, MethodComponent, MethodParameterComponent, SelectDatasetComponent, ExampleDataComponent, AnnotateDatasetComponent, GsaFormComponent, LocalDataComponent, ExternalDataComponent, LoadingProgressComponent, StatisticalDesignComponent, DropdownComponent, DatasetFormComponent, OptionsComponent, AnalysisComponent, AddDatasetButtonComponent, ChangeAnalysisParamsComponent, ScrollableComponent, SaveDatasetButtonComponent, WarningSnackbarComponent
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
    TableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    StoreModule.forFeature(methodFeature),
    StoreModule.forFeature(datasetSourceFeature),
    StoreModule.forFeature(datasetFeature),
    StoreModule.forFeature(analysisFeature),
    EffectsModule.forFeature(MethodEffects),
    EffectsModule.forFeature(DatasetSourceEffects),
    EffectsModule.forFeature(DatasetEffects),
    EffectsModule.forFeature(AnalysisEffects),
    LetModule,
  ],
  bootstrap: [GsaFormComponent]
})

export class GsaFormModule {
}

// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {AppComponent} from "../app.component";

// platformBrowserDynamic().bootstrapModule(GsaFormModule).catch(err => {
//   console.error(err)
// });
