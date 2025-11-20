import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { QuizStore } from '../quiz.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { Quiz } from '../types/quiz';

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

  getById(id: string) {
    return this.#quizStore.getById(id);
  }

  getNew() {
    return this.#quizStore.getNew();
  }

  publish(quiz: Quiz): Quiz {
    return this.#quizStore.publish(quiz);
  }

  save(quiz: Quiz): Quiz {
    return this.#quizStore.save(quiz);
  }
}
