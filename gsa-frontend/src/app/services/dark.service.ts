import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkService {

  private _isDark: boolean = false

  constructor() {
    const localValue = localStorage.getItem('is-dark');
    if (localValue) this._isDark = JSON.parse(localValue);
    else if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
      this._isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  get isDark(): boolean {
    return this._isDark;
  }

  set isDark(value: boolean) {
    this._isDark = value;
    localStorage.setItem('is-dark', JSON.stringify(value))
  }
}
