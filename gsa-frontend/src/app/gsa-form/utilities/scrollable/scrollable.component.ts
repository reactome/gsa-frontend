import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {TourService} from "ngx-ui-tour-md-menu";
import {merge, mergeAll} from "rxjs";

@UntilDestroy()
@Component({
  selector: 'gsa-scrollable',
  templateUrl: './scrollable.component.html',
  styleUrls: ['./scrollable.component.scss']
})
export class ScrollableComponent implements AfterViewInit {
  @Input() topMargin: number = 0;
  @Input() bottomMargin: number = 0;
  @Input() name: string = '';
  @ViewChild('scrollable') scrollable: ElementRef<HTMLDivElement>;

  scroll: boolean = true;
  tourActive: boolean = false;
  shadows = {top: false, bottom: true};

  constructor(private scrollService: ScrollService, private tourService: TourService) {
    this.scrollService.resize$.pipe(untilDestroyed(this)).subscribe(() => this.updateShadows());

    this.tourService.start$.pipe(untilDestroyed(this)).subscribe(() => {
      this.scroll = false;
      this.tourActive = true;
    } );
    this.tourService.end$.pipe(untilDestroyed(this)).subscribe(() => {
      this.scroll = true;
      this.tourActive = false;
    });
    this.tourService.resume$.pipe(untilDestroyed(this)).subscribe(() => this.scroll = false);
    this.tourService.pause$.pipe(untilDestroyed(this)).subscribe(() => this.scroll = true);


    this.scroll = this.tourService.getStatus() !== 1;
    this.tourActive = this.tourService.getStatus() !== 0;
  }

  ngAfterViewInit() {
    this.updateShadows();
    this.tourService.setDefaults({
      scrollContainer: this.scrollable.nativeElement,
      isAsync: true
    });
  }

  scrolling() {
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
