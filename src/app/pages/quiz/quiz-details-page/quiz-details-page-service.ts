import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, switchMap, tap } from 'rxjs';
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
    filter(quizId => quizId !== null),
    tap(quizId => {
      if (quizId !== 'create') {
         this.getById(quizId);
      } else {
        this.getNew();
      }
    })
  );

  readonly #quiz$ = new BehaviorSubject<Quiz | undefined>(undefined);
  readonly quiz$ = this.#quiz$.asObservable();

  isLoading$ = toObservable(this.#quizStore.isLoading); 

  getById(id: string) {
    this.#quiz$.next(this.#quizStore.getById(id));
  }

  getNew() {
    this.#quiz$.next(this.#quizStore.getNew());
  }

  publish(quiz: Quiz): Quiz {
    const savedQuiz = this.#quizStore.publish(quiz);
    this.#quiz$.next(savedQuiz);
    return savedQuiz;
  }

  save(quiz: Quiz): Quiz {
    const savedQuiz = this.#quizStore.save(quiz);
    this.#quiz$.next(savedQuiz);
    return savedQuiz;
  }
}
