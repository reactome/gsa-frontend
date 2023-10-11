import {Injectable} from '@angular/core';
import {TourService} from "ngx-ui-tour-md-menu";
import {map, merge, Observable, shareReplay, startWith} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {IMdStepOption} from "ngx-ui-tour-md-menu/lib/step-option.interface";

export type TourStatus = 'on' | 'off' | 'pause';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class TourUtilsService {
  on: boolean = false;
  paused: boolean = false;

  state$: Observable<TourStatus> = merge(
    this.tourService.start$.pipe(map(() => 'on')) as Observable<TourStatus>,
    this.tourService.end$.pipe(map(() => 'off')) as Observable<TourStatus>,
    this.tourService.pause$.pipe(map(() => 'pause')) as Observable<TourStatus>,
    this.tourService.resume$.pipe(map(() => 'on')) as Observable<TourStatus>,
  ).pipe(
    startWith('off' as TourStatus),
    shareReplay(1)
  );

  constructor(private tourService: TourService) {
    this.tourService.start$.pipe(untilDestroyed(this)).subscribe(() => {
      this.on = true;
      this.paused = false;
    });
    this.tourService.end$.pipe(untilDestroyed(this)).subscribe(() => {
      this.on = false;
      this.paused = false;
    });
    this.tourService.pause$.pipe(untilDestroyed(this)).subscribe(() => this.paused = true);
    this.tourService.resume$.pipe(untilDestroyed(this)).subscribe(() => this.paused = false);
  }


  end() {
    this.tourService.end();
  }

  hasNext(step: IMdStepOption): boolean {
    return this.tourService.hasNext(step);
  }

  next() {
    this.tourService.next()
  }

  pause() {
    this.tourService.pause()
  }

  resume() {
    this.tourService.resume()
  }

  start() {
    this.tourService.start()
  }
}
