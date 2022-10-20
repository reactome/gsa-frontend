import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AnalysisMethodsComponent} from "./gsa-form/analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "./gsa-form/datasets/select-dataset/select-dataset.component";
import {AnnotateDatasetComponent} from "./gsa-form/datasets/annotate-dataset/annotate-dataset.component";

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
