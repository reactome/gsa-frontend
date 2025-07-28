import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {GsaFormComponent} from "./gsa-form.component";

const routes: Routes = [
  {
    path: '',
    component: GsaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GsaFormRoutingModule { }
