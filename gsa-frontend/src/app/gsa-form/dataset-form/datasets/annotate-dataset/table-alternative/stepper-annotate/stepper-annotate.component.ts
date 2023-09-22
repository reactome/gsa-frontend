import {Component, Input, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {TableStore} from "../../../../../utilities/table/state/table.store";
import {Subset} from "../../../../../model/utils.model";
import {Settings} from "../../../../../model/table.model";

@Component({
  selector: 'gsa-stepper-annotate',
  templateUrl: './stepper-annotate.component.html',
  styleUrls: ['./stepper-annotate.component.scss'],
  providers: [TableStore]
})
export class StepperAnnotateComponent {
  @Input() tableSettings: Subset<Settings>;
  @ViewChild('stepper') stepper: MatStepper;
  @Input() datasetName: string;

  columnStep: FormGroup;
  cellStep: FormGroup;

  constructor(public tableStore: TableStore) {
  }
}
