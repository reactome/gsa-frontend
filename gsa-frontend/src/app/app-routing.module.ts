import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {GsaFormModule} from "../../projects/reactome-gsa-form/src/lib/gsa-form.module";

export const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'form', loadChildren: () => GsaFormModule},
  {path: '',  redirectTo: '/home', pathMatch: 'full'}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
