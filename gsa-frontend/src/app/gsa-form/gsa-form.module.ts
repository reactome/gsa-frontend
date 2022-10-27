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
import {ExampleDataComponent} from './datasets/select-dataset/example-data/example-data.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AnnotateDatasetComponent} from './datasets/annotate-dataset/annotate-dataset.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from "@angular/material/stepper";
import {StepperComponent} from './stepper/stepper.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LocalDataComponent} from './datasets/select-dataset/local-data/local-data.component';
import {ImportDataComponent} from './datasets/select-dataset/import-data/import-data.component';
import {
  ImportParameterComponent
} from "./datasets/select-dataset/import-data/import-parameter/import-parameter.component";
import {MethodParameterComponent} from "./analysis-methods/method-parameter/method-parameter.component";
import {AgGridModule} from "ag-grid-angular";
import {HotTableModule} from "@handsontable/angular";
import {BrowserModule} from '@angular/platform-browser';
import {registerAllModules} from 'handsontable/registry';
import { LoadingProgressComponent } from './datasets/select-dataset/loading-progress/loading-progress.component';
import { TableComponent } from './datasets/annotate-dataset/table/table.component';
import { StatisticalDesignComponent } from './datasets/statistical-design/statistical-design.component';
import { DropdownComponent } from './datasets/statistical-design/dropdown/dropdown.component';
import {MatMenuModule} from "@angular/material/menu";
import { NestedStepperComponent } from './stepper/nested-stepper/nested-stepper.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

registerAllModules();

@NgModule({
  declarations: [
    AnalysisMethodsComponent, MethodComponent, MethodParameterComponent, SelectDatasetComponent, ExampleDataComponent, AnnotateDatasetComponent, StepperComponent, LocalDataComponent, ImportDataComponent, ImportParameterComponent, LoadingProgressComponent, TableComponent, StatisticalDesignComponent, DropdownComponent, NestedStepperComponent
  ],
  exports: [
    AnalysisMethodsComponent,
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
    HotTableModule,
    BrowserModule,
    MatMenuModule,
    MatCheckboxModule
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
