import { Component, inject } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { combineLatest, map } from 'rxjs';
import { QuizListPageService } from './quiz-list-page-service';
import { AsyncPipe } from '@angular/common';
import { Quiz } from '../types/quiz';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-list-page',
  templateUrl: './quiz-list-page.html',
  imports: [AsyncPipe],
  styles: [],
  providers: [QuizStore, QuizListPageService],
})
export class QuizListPage {
  readonly #quizListService = inject(QuizListPageService); 
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  vm$ = combineLatest([
    this.#quizListService.quizzes$
  ]).pipe(
    map(([ quizzes ]) => ({
      quizzes,
    }))
  )

  handleEdit(quiz: Quiz) {
    this.#router.navigate([ quiz.id ], { relativeTo: this.#route });
  }

  handleTakeQuiz(quiz: Quiz) {
    this.#router.navigate([ 'take', quiz.id ], { relativeTo: this.#route });
  }
}
