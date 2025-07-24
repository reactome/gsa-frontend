import {Component, input, model} from '@angular/core';

@Component({
  selector: 'gsa-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: false
})
export class DropdownComponent {
  readonly options = input<any[]>();
  readonly placeholder = input<string>();

  readonly value = model.required<string>();
  readonly disabled = input<boolean>(false);
  default?: string;

  constructor() {
  }

}
