import { Component, inject } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { combineLatest, map } from 'rxjs';
import { QuizListPageService } from './quiz-list-page-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Quiz } from '../types/quiz';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { TestStore } from '../test.store';
import { Test } from '../types/test';

@Component({
  selector: 'app-quiz-list-page',
  templateUrl: './quiz-list-page.html',
  imports: [AsyncPipe, DatePipe],
  styles: [],
  providers: [QuizStore, TestStore, QuizListPageService],
})
export class QuizListPage {
  readonly #quizListService = inject(QuizListPageService); 
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  vm$ = combineLatest([
    toObservable(this.#quizListService.quizzes$),
    toObservable(this.#quizListService.tests$),
  ]).pipe(
    map(([ quizzes, tests ]) => ({
      quizzes,
      tests
    }))
  )

  handleEdit(quiz: Quiz) {
    this.#router.navigate([ quiz.id ], { relativeTo: this.#route });
  } 

  handleTakeQuiz(quiz: Quiz) {
    this.#router.navigate([ quiz.id, 'take' ], { relativeTo: this.#route });
  }

  testTimeTaken(quiz: Quiz): number {
    const test = this.#quizListService.tests$().find(t => t.id === quiz.id);
    return test ? quiz.timeLimit - test.timeTaken : quiz.timeLimit;
  }

  getQuizTest(quiz: Quiz): Test | undefined {
    return this.#quizListService.tests$().find(t => t.id === quiz.id);
  }

  getQuizMaxScore(quiz: Quiz): number {
    return quiz.questions.reduce((sum, question) => sum + question.pointValue, 0) || 0;
  }
}
