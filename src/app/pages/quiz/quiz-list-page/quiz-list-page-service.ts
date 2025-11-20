import { computed, inject, Injectable } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class QuizListPageService {
  readonly #quizStore = inject(QuizStore);

  quizzes$ = computed(() => {
    return this.#quizStore.quizzes();
  });

  constructor() {
    this.#quizStore.getAll();
  }
}
