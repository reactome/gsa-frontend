import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AnalysisMethodsComponent} from "../../analysis-methods/analysis-methods.component";
import {SelectDatasetComponent} from "../../datasets/select-dataset/select-dataset.component";
import {AnnotateDatasetComponent} from "../../datasets/annotate-dataset/annotate-dataset.component";
import {StatisticalDesignComponent} from "../../datasets/statistical-design/statistical-design.component";

@Component({
  selector: 'gsa-nested-stepper',
  templateUrl: './nested-stepper.component.html',
  styleUrls: ['./nested-stepper.component.scss']
})
export class NestedStepperComponent implements AfterViewInit {

  frmStepTwo: FormGroup;

  form2: FormGroup;
  form3: FormGroup;
  form4: FormGroup;
  @ViewChild('selectMethod') analysisMethodsComponent: AnalysisMethodsComponent;
  @ViewChild('selectData') selectDatasetComponent: SelectDatasetComponent;
  @ViewChild('annotateData') annotateDatasetComponent: AnnotateDatasetComponent;
  @ViewChild("statisticalDesign") statisticalDesignComponent: StatisticalDesignComponent

  constructor(private cdr: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.frmStepTwo = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.form2 = this.selectDatasetComponent.frmStepTwo
    this.form3 = this.annotateDatasetComponent.frmStepThree
    this.form4 = this.statisticalDesignComponent.frmStepFour

    this.cdr.detectChanges();
  }

  ngOnInit(): void {

  }


}
