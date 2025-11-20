import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TakeQuizService } from './take-quiz-service';

@Component({
  selector: 'app-take-quiz',
  imports: [AsyncPipe, JsonPipe],
  providers: [TakeQuizService],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.scss',
})
export class TakeQuiz {

  readonly #takeQuizService = inject(TakeQuizService);

  vm$ = this.#takeQuizService.quiz$;
}
