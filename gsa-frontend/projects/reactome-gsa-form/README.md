# Reactome Gsa Form

[![npm version](https://badge.fury.io/js/reactome-gsa-form.svg)](https://badge.fury.io/js/reactome-gsa-form)
[![npm downloads a month](https://img.shields.io/npm/dm/reactome-gsa-form.svg)](https://img.shields.io/npm/dm/reactome-gsa-form.svg)

This Angular library embeds UI to query Reactome GSA APIs and create reactome analysis.

## Compatibility

| reactome-gsa-form version | angular version |
|---------------------------|-----------------|
| 19.X.X                    | 19.X.X          |

## Install

```
npm install --save reactome-gsa-form
```

## Usage

### styles.scss
 ```scss
@use "reactome-gsa-form";

@include reactome-gsa-form.configure-gsa-form();
// If You want to use a different symbol version from the default
body {
  --reactome-table-symbols-font-family: 'Material Symbols Outlined';
  --reactome-symbols-variation-settings:  'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### Importing module
#### Eager loading

```ts
import {NgModule} from '@angular/core';
import {GsaFormModule} from "reactome-gsa-form";


@NgModule({
  imports: [
    GsaFormModule.forRoot({
      apiRoot: environment.ApiRoot, // Needs proxy to access API
      apiSecretRoot: environment.ApiSecretRoot, // Needs proxy to access API
      server: environment.server as "dev" | "production",
    }),
  ]
})
export class AppModule {
}

```

#### Lazy loading
```ts
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {environment} from "../environments/environment";

export const routes: Routes = [{
    path: 'form',
    loadChildren: () => import('reactome-gsa-form').then(m => m.GsaFormModule.forChild(
      {
        apiRoot: environment.ApiRoot, // Needs proxy to access API
        apiSecretRoot: environment.ApiSecretRoot, // Needs proxy to access API
        server: environment.server as "dev" | "production",
      }
    )),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
```

### Main component
The main component is `<gsa-form>`.  

### Tour
If gsa-tour is available in the URL at instantiation time, then a tour will be started automatically.

It can also be triggered manually after having been instantiated by using the `TourUtilsService`

```ts
import {Inject} from "@angular/core";
import {TourUtilsService} from "reactome-gsa-form";

@Inject(TourUtilsService)
const tourService: TourUtilsService;

tourService.start()
```
