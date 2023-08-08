import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {SelectDatasetComponent} from './datasets/select-dataset/select-dataset.component';
import {ExampleDataComponent} from './datasets/select-dataset/dataset-types/example-data/example-data.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AnnotateDatasetComponent} from './datasets/annotate-dataset/annotate-dataset.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from "@angular/material/stepper";
import {StepperComponent} from './stepper/stepper.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LocalDataComponent} from './datasets/select-dataset/dataset-types/local-data/local-data.component';
import {ExternalDataComponent} from './datasets/select-dataset/dataset-types/external-data/external-data.component';
import {
  ExternalParameterComponent
} from "./datasets/select-dataset/dataset-types/external-data/external-parameter/external-parameter.component";
import {MethodParameterComponent} from "./utilities/method-parameter/method-parameter.component";
import {AgGridModule} from "ag-grid-angular";
import {BrowserModule} from '@angular/platform-browser';
import {LoadingProgressComponent} from './datasets/select-dataset/loading-progress/loading-progress.component';
import {StatisticalDesignComponent} from './datasets/statistical-design/statistical-design.component';
import {DropdownComponent} from './utilities/dropdown/dropdown.component';
import {MatMenuModule} from "@angular/material/menu";
import {NestedStepperComponent} from './stepper/nested-stepper/nested-stepper.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {OptionsComponent} from "./options/options.component";
import {AnalysisComponent} from './analysis/analysis.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {EditColumnsComponent} from './datasets/annotate-dataset/table-alternative/edit-columns/edit-columns.component';
import {EditCellsComponent} from './datasets/annotate-dataset/table-alternative/edit-cells/edit-cells.component';
import {
  StepperAnnotateComponent
} from './datasets/annotate-dataset/table-alternative/stepper-annotate/stepper-annotate.component';
import {MatDialogModule} from "@angular/material/dialog";
import {AddDatasetButtonComponent} from './datasets/annotate-dataset/add-dataset-button/add-dataset-button.component';
import {ChangeAnalysisParamsComponent} from './datasets/change-analysis-params/change-analysis-params.component';
import {ScrollableComponent} from './utilities/scrollable/scrollable.component';
import {
  SaveDatasetButtonComponent
} from './datasets/annotate-dataset/save-dataset-button/save-dataset-button.component';
import {
  WarningSnackbarComponent
} from './datasets/annotate-dataset/add-dataset-button/warning-snackbar/warning-snackbar.component';
import {TableModule} from "./utilities/table/table.module";
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {StoreModule} from "@ngrx/store";
import {methodFeature} from "./state/method/method.selector";
import {EffectsModule} from "@ngrx/effects";
import {MethodEffects} from "./state/method/method.effect";
import {parameterFeature} from "./state/parameter/parameter.selector";
import {datasetSourceFeature} from "./state/dataset-source/dataset-source.selector";
import {DatasetSourceEffects} from "./state/dataset-source/dataset-source.effect";
import {datasetFeature} from "./state/dataset/dataset.selector";
import {LoadedDatasetEffects} from "./state/dataset/dataset.effect";

@NgModule({
  declarations: [
    AnalysisMethodsComponent, MethodComponent, MethodParameterComponent, SelectDatasetComponent, ExampleDataComponent, AnnotateDatasetComponent, StepperComponent, LocalDataComponent, ExternalDataComponent, ExternalParameterComponent, LoadingProgressComponent, StatisticalDesignComponent, DropdownComponent, NestedStepperComponent, OptionsComponent, AnalysisComponent, EditColumnsComponent, EditCellsComponent, StepperAnnotateComponent, AddDatasetButtonComponent, ChangeAnalysisParamsComponent, ScrollableComponent, SaveDatasetButtonComponent, WarningSnackbarComponent
  ],
  exports: [
    StepperComponent
  ],
  imports: [
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
    AgGridModule,
    BrowserModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    TableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    StoreModule.forFeature(methodFeature),
    StoreModule.forFeature(parameterFeature),
    StoreModule.forFeature(datasetSourceFeature),
    StoreModule.forFeature(datasetFeature),
    EffectsModule.forFeature(MethodEffects),
    EffectsModule.forFeature(DatasetSourceEffects),
    EffectsModule.forFeature(LoadedDatasetEffects),
  ],
  // bootstrap: [SelectDatasetComponent]
})

export class GsaFormModule {
}

// import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
// import {AppComponent} from "../app.component";

// platformBrowserDynamic().bootstrapModule(GsaFormModule).catch(err => {
//   console.error(err)
// });
