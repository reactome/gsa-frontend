import {Component} from '@angular/core';
import {HeightService} from "./services/height.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gsa';
  constructor(public height: HeightService) {
  }
}
