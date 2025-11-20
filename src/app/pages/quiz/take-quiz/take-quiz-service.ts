import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../quiz.store';

@Injectable({
  providedIn: 'root',
})
export class TakeQuizService {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  readonly quiz$ = computed(() => this.#quizStore.selectedQuiz());

  constructor() {
    this.#route.paramMap.subscribe(params => {
      const quizId = params.get('quizId');
      if (quizId) {
        this.#quizStore.getById(quizId);
      }
    });
  }
}
  providedIn: 'root',
})
export class TakeQuizService {
  
}
