import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalysisMethodsComponent} from "./analysis-methods/analysis-methods.component";
import {HeaderComponent} from "./general-usage/header/header.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import { MethodComponent } from './analysis-methods/method/method.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import { MatInputModule } from '@angular/material/input';
import { SelectDatasetComponent } from './select-dataset/select-dataset.component';
import { ExampleDataComponent } from './select-dataset/example-data/example-data.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import { AnnotateDatasetComponent } from './annotate-dataset/annotate-dataset.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatStepperModule} from "@angular/material/stepper";
import { StepperComponent } from './general-usage/stepper/stepper.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LocalDataComponent } from './select-dataset/local-data/local-data.component';
import { ImportDataComponent } from './select-dataset/import-data/import-data.component';
import {ImportParameterComponent} from "./select-dataset/import-data/import-parameter/import-parameter.component";
import {MethodParameterComponent} from "./analysis-methods/method-parameter/method-parameter.component";

@NgModule({
  declarations: [
    AnalysisMethodsComponent, HeaderComponent, MethodComponent, MethodParameterComponent, SelectDatasetComponent, ExampleDataComponent, AnnotateDatasetComponent, StepperComponent, LocalDataComponent, ImportDataComponent, ImportParameterComponent
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
    MatProgressSpinnerModule
  ]
})

export class GsaFormModule { }
