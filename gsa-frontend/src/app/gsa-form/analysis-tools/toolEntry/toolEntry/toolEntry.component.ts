import {Component, Input, OnInit} from '@angular/core';
import {Tool} from "../../../model/tool.model";

@Component({
  selector: 'app-toolEntry',
  templateUrl: './toolEntry.component.html',
  styleUrls: ['./toolEntry.component.css']
})
export class ToolEntryComponent implements OnInit {
  @Input() tool?: Tool
  @Input() used: boolean = false
  constructor() { }

  ngOnInit(): void {
  }

}
