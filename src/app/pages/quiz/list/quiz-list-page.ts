import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStore } from '../../../lib/stores/quiz.store';

@Component({
  selector: 'app-quiz-list-page',
  standalone: true,
  imports: [CommonModule],
  providers: [QuizStore],
  templateUrl: './quiz-list-page.html',
})
export class QuizListPage {
  readonly #quizStore = inject(QuizStore);

  quizzes$ = this.#quizStore.quizzes;
}
