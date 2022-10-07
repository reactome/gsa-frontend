import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalysisToolsComponent} from "./analysis-tools/analysisTools.component";
import {HeaderComponent} from "./generalUsage/header/header.component";
import {NavButtonComponent} from "./generalUsage/navigationButtons/navButton.component";
import {ToolEntryComponent} from "./analysis-tools/toolEntry/toolEntry/toolEntry.component";



@NgModule({
  declarations: [
    AnalysisToolsComponent, HeaderComponent, NavButtonComponent, ToolEntryComponent
  ],
  exports: [
    AnalysisToolsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GsaFormModule { }
