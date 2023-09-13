import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private resizeEmitter: EventEmitter<void> = new EventEmitter<void>();
  public resize$: Observable<void> = this.resizeEmitter.asObservable();

  constructor() {}

  public triggerResize(): void {
    this.resizeEmitter.next();
  }
}
