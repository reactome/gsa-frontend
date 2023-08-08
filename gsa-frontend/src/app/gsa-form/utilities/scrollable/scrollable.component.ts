import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'gsa-scrollable',
  templateUrl: './scrollable.component.html',
  styleUrls: ['./scrollable.component.scss']
})
export class ScrollableComponent implements AfterViewInit {
  @Input() topMargin: number = 0;
  @Input() bottomMargin: number = 0;
  @ViewChild('scrollable') scrollable: ElementRef<HTMLDivElement>;

  scroll: boolean = false;
  shadows = {top: false, bottom: true};

  constructor(private scrollService: ScrollService) {
    this.scrollService.resize$.pipe(untilDestroyed(this)).subscribe(() => this.updateShadows());
  }


  ngAfterViewInit() {
    this.updateShadows();
  }

  scrolling() {
    this.scroll = true
    setTimeout(() => this.scroll = false, 2000);
    this.updateShadows();
  }

  public updateShadows() {
    setTimeout(() => {
      const scrollable = this.scrollable.nativeElement;
      this.shadows.top = scrollable.scrollTop > this.topMargin;
      this.shadows.bottom = scrollable.clientHeight + scrollable.scrollTop + this.bottomMargin < scrollable.scrollHeight;
    })
  }

}
