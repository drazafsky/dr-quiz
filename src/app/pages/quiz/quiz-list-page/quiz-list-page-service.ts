import { computed, inject, Injectable } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { TestStore } from '../test.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class QuizListPageService {
  readonly #quizStore = inject(QuizStore);

  readonly #testStore = inject(TestStore);

  quizzes$ = computed(() => {
    return this.#quizStore.quizzes();
  });

  tests$ = computed(() => {
    return this.#testStore.tests();
  });

  constructor() {
    this.#quizStore.getAll();
    this.#testStore.getAll();
  }
}
