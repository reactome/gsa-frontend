import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AnalysisMethodsComponent} from "./gsa-form/analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "./gsa-form/select-dataset/select-dataset.component";

const routes: Routes = [
  { path: '', redirectTo: '/methods', pathMatch: 'full' },
  { path: 'methods', component: AnalysisMethodsComponent },
  { path: 'selectDataset', component: SelectDatasetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
