import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkService {

  private _body: HTMLBodyElement | null;
  private _isDark: boolean = false;

  constructor() {
    this._body = document.querySelector('body');

    // Update theme if other tabs are changing it
    window.addEventListener('storage', (e) => {
      if (e.key === 'is-dark') this.isDark = JSON.parse(e.newValue || 'false');
    });

    const localValue = localStorage.getItem('is-dark');
    if (localValue) this.isDark = JSON.parse(localValue);
    else if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  get isDark(): boolean {
    return this._isDark;
  }

  set isDark(value: boolean) {
    this._isDark = value;
    localStorage.setItem('is-dark', JSON.stringify(value));
    if (value) this._body?.classList.add('dark');
    else this._body?.classList.remove('dark');
  }
}
