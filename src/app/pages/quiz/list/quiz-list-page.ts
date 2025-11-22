import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { ToolbarComponent } from '../../../lib/components/toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../lib/components/card/card';
import { Quiz } from '../../../lib/types/quiz';

@Component({
  selector: 'app-quiz-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    CardComponent
  ],
  providers: [QuizStore],
  templateUrl: './quiz-list-page.html',
})
export class QuizListPage {
  readonly #quizStore = inject(QuizStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  quizzes$ = this.#quizStore.quizzes;

  handleNew() {
    this.#router.navigate(['create'], { relativeTo: this.#route });
  }

  handleEdit(quiz: Quiz) {
    this.#router.navigate([quiz.id], { relativeTo: this.#route });
  }
}
