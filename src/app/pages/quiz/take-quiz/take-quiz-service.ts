import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../quiz.store';
import { TestStore } from '../test.store';

@Injectable({
  providedIn: 'root',
})
export class TakeQuizService {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  readonly #testStore = inject(TestStore);

  readonly quiz$ = computed(() => this.#quizStore.selectedQuiz());

  save(test: any) {
    this.#testStore.save(test);
  }

  constructor() {
    this.#route.paramMap.subscribe(params => {
      const quizId = params.get('quizId');
      if (quizId) {
        this.#quizStore.getById(quizId);
      }
    });
  }
}
