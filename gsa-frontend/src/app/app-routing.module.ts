import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {environment} from "../environments/environment";

export const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {
    path: 'form',
    loadChildren: () => import('reactome-gsa-form').then(m => m.GsaFormModule.forChild(
      {
        apiRoot: environment.ApiRoot,
        apiSecretRoot: environment.ApiSecretRoot,
        server: environment.server as "dev" | "production",
      }
    )),
  },
  {path: '', redirectTo: '/home', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
