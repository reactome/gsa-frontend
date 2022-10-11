import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalysisMethodsComponent} from "./analysis-methods/analysis-methods.component";
import {HeaderComponent} from "./general-usage/header/header.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import { MethodComponent } from './analysis-methods/method/method.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ParameterComponent } from './analysis-methods/parameter/parameter.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import { MatInputModule } from '@angular/material/input';
import { SelectDatasetComponent } from './select-dataset/select-dataset.component';

@NgModule({
  declarations: [
    AnalysisMethodsComponent, HeaderComponent, MethodComponent, ParameterComponent, ParameterComponent, SelectDatasetComponent
  ],
  exports: [
    AnalysisMethodsComponent
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
        MatInputModule
    ]
})

export class GsaFormModule { }
