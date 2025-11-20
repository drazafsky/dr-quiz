import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TakeQuizService } from './take-quiz-service';
import { combineLatest, map } from 'rxjs';
import { QuizStore } from '../quiz.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-take-quiz',
  imports: [AsyncPipe, JsonPipe],
  providers: [QuizStore, TakeQuizService],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.scss',
})
export class TakeQuiz {
  readonly #takeQuizService = inject(TakeQuizService);

  vm$ = combineLatest([
    toObservable(this.#takeQuizService.quiz$),
  ]).pipe(
    map(([ quiz ]) => ({
      quiz,
    }))
  );
}
