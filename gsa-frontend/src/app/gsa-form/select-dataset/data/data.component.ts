import {Component, Input, OnInit} from '@angular/core';
import {Dataset} from "../../model/dataset.model";
import {Router} from "@angular/router";

@Component({
  selector: 'gsa-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  @Input() data: Dataset

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doStuff() {
    console.log(this.data)
    // if (this.data.parameters == null){
    //   this.router.navigate(['/annotateDataset']);
    // }
  }
}
