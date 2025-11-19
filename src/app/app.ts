import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly #title$ = signal('DR Quiz');
  readonly #isNavOpen$ = signal(true);

  vm$ = combineLatest([
    toObservable(this.#title$),    
    toObservable(this.#isNavOpen$),
  ])
  .pipe(
    map(([title, isNavOpen]) => ({
      title,
      isNavOpen,
    }))
  )

  toggleNav() {
    this.#isNavOpen$.set(!this.#isNavOpen$());
  }
}
