import {ApplicationRef, DoBootstrap, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TableComponent} from "../../../reactome-table/src/lib/component/table/table.component";
import {ReactomeTableModule} from "../../../reactome-table/src/lib/reactome-table.module";
import {createCustomElement} from "@angular/elements";

@NgModule({
  imports: [
    BrowserModule,
    ReactomeTableModule
  ],
  providers: []
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap(appRef: ApplicationRef): void {
    customElements.define('reactome-table-wc', createCustomElement(TableComponent, {injector: this.injector}))
  }


}
