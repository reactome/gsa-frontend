import {Component, Input, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {Settings} from "../../../../model/table.model";

@Component({
  selector: 'gsa-stepper-annotate',
  templateUrl: './stepper-annotate.component.html',
  styleUrls: ['./stepper-annotate.component.scss']
})
export class StepperAnnotateComponent {
  @Input() tableSettings: Settings;
  @ViewChild('stepper') stepper: MatStepper;
  @Input() datasetName: string;

  columnStep: FormGroup;
  cellStep: FormGroup;

  constructor() {
  }
}
