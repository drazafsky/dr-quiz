import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { UserStore } from './lib/stores/user.store';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterModule, RouterOutlet],
  providers: [UserStore],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly #title$ = signal('DR Quiz');
  readonly #isNavOpen$ = signal(true);
  readonly #userStore = inject(UserStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  showNavBar = false;

  vm$ = combineLatest([
    toObservable(this.#title$),    
    toObservable(this.#isNavOpen$),
    toObservable(this.#userStore.loggedInUser)
  ])
  .pipe(
    map(([title, isNavOpen, loggedInUser]) => ({
      title,
      isNavOpen,
      loggedInUser
    }))
  )

  constructor() {
    effect(() => {
      const user = this.#userStore.loggedInUser();
      if (user?.id) {
        this.#router.navigate(['intro'], { relativeTo: this.#route });
        return;
      }

      this.#router.navigate(['/']);
    });
  }

  toggleNav() {
    this.#isNavOpen$.set(!this.#isNavOpen$());
  }
}
