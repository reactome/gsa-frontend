import {Component, Input, OnInit} from '@angular/core';
import {Tool} from "../../tool";

@Component({
  selector: 'app-tool-entry',
  templateUrl: './tool-entry.component.html',
  styleUrls: ['./tool-entry.component.css']
})
export class ToolEntryComponent implements OnInit {
  @Input() used: boolean = false
  @Input() tool?: Tool
  constructor() { }

  ngOnInit(): void {
  }

}
