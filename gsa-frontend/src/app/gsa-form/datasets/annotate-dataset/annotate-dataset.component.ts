import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoadDatasetService} from "../../services/load-dataset.service";
import {CellInfo, Settings} from "../../model/table.model";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent{

  frmStepTwoTwo: FormGroup;
  settings: Settings = {

    columns: this.loadDataService.columns[this.loadDataService.currentDataset],
    rows: this.loadDataService.rows[this.loadDataService.currentDataset],
    data: this.loadDataService.datasets[this.loadDataService.currentDataset],
    rename_rows: false
  }


  constructor(private formBuilder: FormBuilder, public loadDataService: LoadDatasetService) {
    this.frmStepTwoTwo = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
  // , private ref:ChangeDetectorRef
    // this.ref.detectChanges();
  }
}


