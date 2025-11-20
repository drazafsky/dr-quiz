import { inject, Injectable } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizListPageService {
  readonly #quizStore = inject(QuizStore);

  quizzes$ = of(this.#quizStore.getAll());
}
