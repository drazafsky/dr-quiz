import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { QuizStore } from '../quiz.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class QuizDetailsPageService {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  quizId$ = this.#route.paramMap.pipe(
    map(params => params.get('quizId')),
  );

  isLoading$ = toObservable(this.#quizStore.isLoading);

  getById(id: number) {
    return this.#quizStore.getById(id);
  }

  getNew() {
    return this.#quizStore.getNew();
  }
}
