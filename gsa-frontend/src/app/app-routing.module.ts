import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

export const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'form', loadChildren: () => import('./gsa-form/gsa-form.module').then(m => m.GsaFormModule)},
  {path: '',  redirectTo: '/home', pathMatch: 'full'}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
