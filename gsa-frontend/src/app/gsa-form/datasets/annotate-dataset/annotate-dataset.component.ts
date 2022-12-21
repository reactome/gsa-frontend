import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Settings} from "../../model/table.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Dataset} from "../../model/dataset.model";


@Component({
  selector: 'gsa-annotate-dataset',
  templateUrl: './annotate-dataset.component.html',
  styleUrls: ['./annotate-dataset.component.scss']
})
export class AnnotateDatasetComponent implements OnInit {
  @ViewChild('hiddenText') textEl: ElementRef;
  @Input() dataset: Dataset;
  annotateDataStep: FormGroup;
  tableSettings: Settings;
  screenIsSmall: boolean = false;
  renameWidth: number = 100;

  constructor(private formBuilder: FormBuilder, private responsive: BreakpointObserver) {
    this.annotateDataStep = this.formBuilder.group({
      address: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.tableSettings = {
      columns: this.dataset.table!.columns,
      rows: this.dataset.table!.rows,
      data: this.dataset.table!.dataset,
      renameRows: false,
      showRows: true,
      addColumnButton: true
    };
    this.responsive.observe(Breakpoints.Small).subscribe(result => this.screenIsSmall = result.matches);
    this.resize()
  }

  resize() {
    setTimeout(() => this.renameWidth = Math.max(100, this.textEl.nativeElement.offsetWidth));
  }

}





