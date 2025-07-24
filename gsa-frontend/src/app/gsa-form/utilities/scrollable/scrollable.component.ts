import {AfterViewInit, Component, ElementRef, input, viewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {map} from "rxjs";
import {HeightService} from "../../../services/height.service";
import {TourUtilsService} from "../../../services/tour-utils.service";

@UntilDestroy()
@Component({
    selector: 'gsa-scrollable',
    templateUrl: './scrollable.component.html',
    styleUrls: ['./scrollable.component.scss'],
    standalone: false
})
export class ScrollableComponent implements AfterViewInit {
  readonly topMargin = input<number>(0);
  readonly bottomMargin = input<number>(0);
  readonly name = input<string>('');
  readonly innerClasses = input<string>('');
  readonly scrollable = viewChild.required<ElementRef<HTMLDivElement>>('scrollable');


  tourVisible = this.tour.state$.pipe(map(state => state === 'on'))

  shadows = {top: false, bottom: true};

  constructor(private scrollService: ScrollService, public tour: TourUtilsService, public height: HeightService) {
    this.scrollService.resize$.pipe(untilDestroyed(this)).subscribe(() => this.updateShadows());
  }

  ngAfterViewInit() {
    this.updateShadows();
  }

  scrolling() {
    this.updateShadows();
  }

  public updateShadows() {
    setTimeout(() => {
      const scrollable = this.scrollable().nativeElement;
      this.shadows.top = scrollable.scrollTop > this.topMargin();
      this.shadows.bottom = scrollable.clientHeight + scrollable.scrollTop + this.bottomMargin() < scrollable.scrollHeight;
    })
  }
}
