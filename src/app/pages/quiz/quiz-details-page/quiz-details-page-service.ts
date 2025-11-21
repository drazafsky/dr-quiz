import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Quiz } from '../types/quiz';
import { QuizStore } from '../../../lib/stores/quiz.store';

@Injectable({
  providedIn: 'root',
})
export class QuizDetailsPageService {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  readonly quizId$ = new BehaviorSubject<string | undefined>(undefined);
  readonly quiz$ = computed(() => this.#quizStore.selectedQuiz());

  constructor() {
    this.#route.paramMap.pipe(
      map(params => params.get('quizId')),
      filter(quizId => quizId !== null)
    ).subscribe(quizId => {
        if (quizId !== 'create') {
          this.getById(quizId);
        } else {
          this.getNew();
        }

        this.quizId$.next(quizId);
      });
  }

  getById(id: string) {
    this.#quizStore.getById(id);
  }

  getNew() {
    this.#quizStore.getNew();
  }

  publish(quiz: Quiz) {
    this.#quizStore.publish(quiz);
  }

  save(quiz: Quiz) {
    this.#quizStore.save(quiz);
  }
}
