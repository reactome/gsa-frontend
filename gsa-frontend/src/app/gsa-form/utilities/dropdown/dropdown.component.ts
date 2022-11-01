import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'gsa-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() options: any[];
  @Output() value: EventEmitter<string> = new EventEmitter<string>();
  @Input() selection: string;
  default: string = 'Select one';

  constructor() {
  }

  ngOnInit(): void {
  }

  saveValue() {
    this.value.emit(this.selection);
  }

}
