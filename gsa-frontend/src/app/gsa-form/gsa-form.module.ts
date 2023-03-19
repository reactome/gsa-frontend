import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnalysisMethodsComponent} from "./analysis-methods/analysis-methods.component";
import {MatLegacyProgressBarModule as MatProgressBarModule} from "@angular/material/legacy-progress-bar";
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MethodComponent} from './analysis-methods/method/method.component';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {SelectDatasetComponent} from './datasets/select-dataset/select-dataset.component';
import {ExampleDataComponent} from './datasets/select-dataset/dataset-types/example-data/example-data.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AnnotateDatasetComponent} from './datasets/annotate-dataset/annotate-dataset.component';
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatStepperModule} from "@angular/material/stepper";
import {StepperComponent} from './stepper/stepper.component';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {LocalDataComponent} from './datasets/select-dataset/dataset-types/local-data/local-data.component';
import {ImportDataComponent} from './datasets/select-dataset/dataset-types/import-data/import-data.component';
import {
  ImportParameterComponent
} from "./datasets/select-dataset/dataset-types/import-data/import-parameter/import-parameter.component";
import {MethodParameterComponent} from "./utilities/method-parameter/method-parameter.component";
import {AgGridModule} from "ag-grid-angular";
import {BrowserModule} from '@angular/platform-browser';
import {LoadingProgressComponent} from './datasets/select-dataset/loading-progress/loading-progress.component';
import {TableComponent} from './utilities/table/table.component';
import {StatisticalDesignComponent} from './datasets/statistical-design/statistical-design.component';
import {DropdownComponent} from './utilities/dropdown/dropdown.component';
import {MatLegacyMenuModule as MatMenuModule} from "@angular/material/legacy-menu";
import {NestedStepperComponent} from './stepper/nested-stepper/nested-stepper.component';
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {OptionsComponent} from "./options/options.component";
import {AnalysisComponent} from './analysis/analysis.component';
import {MatLegacySnackBarModule as MatSnackBarModule} from "@angular/material/legacy-snack-bar";
import {EditColumnsComponent} from './datasets/annotate-dataset/table-alternative/edit-columns/edit-columns.component';
import {EditCellsComponent} from './datasets/annotate-dataset/table-alternative/edit-cells/edit-cells.component';
import {
  StepperAnnotateComponent
} from './datasets/annotate-dataset/table-alternative/stepper-annotate/stepper-annotate.component';
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {AddDatasetButtonComponent} from './datasets/annotate-dataset/add-dataset-button/add-dataset-button.component';
import {ChangeAnalysisParamsComponent} from './datasets/change-analysis-params/change-analysis-params.component';
import {ScrollableComponent} from './utilities/scrollable/scrollable.component';
import { SaveDatasetButtonComponent } from './datasets/annotate-dataset/save-dataset-button/save-dataset-button.component';
import { WarningSnackbarComponent } from './datasets/annotate-dataset/add-dataset-button/warning-snackbar/warning-snackbar.component';

@NgModule({
  declarations: [
    AnalysisMethodsComponent, MethodComponent, MethodParameterComponent, SelectDatasetComponent, ExampleDataComponent, AnnotateDatasetComponent, StepperComponent, LocalDataComponent, ImportDataComponent, ImportParameterComponent, LoadingProgressComponent, TableComponent, StatisticalDesignComponent, DropdownComponent, NestedStepperComponent, OptionsComponent, AnalysisComponent, EditColumnsComponent, EditCellsComponent, StepperAnnotateComponent, AddDatasetButtonComponent, ChangeAnalysisParamsComponent, ScrollableComponent, SaveDatasetButtonComponent, WarningSnackbarComponent
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
    MatSnackBarModule
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
