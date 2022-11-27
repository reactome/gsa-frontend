import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MatStepper} from "@angular/material/stepper";
import {Settings} from "../../../../model/table.model";

@Component({
  selector: 'gsa-stepper-annotate',
  templateUrl: './stepper-annotate.component.html',
  styleUrls: ['./stepper-annotate.component.scss']
})
export class StepperAnnotateComponent implements OnInit {
  @Input() settings?: Settings;
  form2_2_1: FormGroup;
  form2_2_2: FormGroup;
  @ViewChild('stepper') stepper: MatStepper;

  constructor() { }

  ngOnInit(): void {
  }

  nextStep() {
    // @ts-ignore
    this.stepper.selected.completed = true;
    this.stepper.next();
  }
}
