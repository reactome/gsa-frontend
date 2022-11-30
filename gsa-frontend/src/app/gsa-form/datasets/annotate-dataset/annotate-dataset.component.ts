import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Settings} from "../../model/table.model";
// import {currentDataset} from "../../model/analysisObject.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {currentDataset} from "../../model/analysisObject.model";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent {

  @Input() currentDataset: currentDataset;
  annotateDataStep: FormGroup;
  tableSettings: Settings;
  screenIsSmall: boolean = false;


  constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver) {
    this.annotateDataStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.tableSettings = {
      columns: this.currentDataset.table!.columns,
      rows: this.currentDataset.table!.rows,
      data: this.currentDataset.table!.dataset,
      renameRows: false
    };
    this.responsive.observe(Breakpoints.Small)
      .subscribe(result => {
        if (result.matches) {
          this.screenIsSmall = true;
        } else this.screenIsSmall = false;
      });
  }


}


