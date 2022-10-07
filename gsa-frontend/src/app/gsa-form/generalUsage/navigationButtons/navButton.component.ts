import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './navButton.component.html',
  styleUrls: ['./navButton.component.css']
})
export class NavButtonComponent implements OnInit {
  @Input() type?: string
  constructor() { }

  ngOnInit(): void {
  }

}
