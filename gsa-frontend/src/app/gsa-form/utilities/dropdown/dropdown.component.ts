import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'gsa-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() options: any[];
  @Input() placeholder: string;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() value?: string;
  @Input() disabled: boolean = false;
  default?: string;


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.saveValue();
  }

  saveValue() {
    this.valueChange.emit(this.value);
  }


}
