import {Component, Input, OnInit} from '@angular/core';
import {Method} from "../../model/methods.model"
import {Router} from "@angular/router";

@Component({
  selector: 'gsa-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit {
  @Input() method?: Method
  showConfig = false


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toggleConfiguration() {
    this.showConfig = ! this.showConfig;
  }

  selectMethod() {
    this.router.navigate(['/selectDataset']);
  }
}
