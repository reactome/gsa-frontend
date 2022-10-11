import {Component, Input, OnInit} from '@angular/core';
import {Method} from "../../model/methods.model"

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit {
  @Input() method?: Method
  showConfig = false

  constructor() { }

  ngOnInit(): void {
  }

  toggleConfiguration() {
    this.showConfig = ! this.showConfig;
  }

  selectMethod() {

  }
}
