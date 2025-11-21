import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';

@Component({
  selector: 'app-quiz-detail-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Quiz Details</h1>
      <div *ngIf="quiz; else notFound">
        <p><strong>Title:</strong> {{ quiz.title }}</p>
        <p><strong>Description:</strong> {{ quiz.description }}</p>
        <p><strong>Time Limit:</strong> {{ quiz.timeLimit }} seconds</p>
        <p><strong>Questions:</strong> {{ quiz.questions.length }}</p>
        <p><strong>Published:</strong> {{ quiz.isPublished ? 'Yes' : 'No' }}</p>
      </div>
      <ng-template #notFound>
        <p>Quiz not found.</p>
      </ng-template>
    </div>
  `,
})
export class QuizDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  quizId = this.#route.snapshot.paramMap.get('quizId');
  quiz = this.#quizStore.state.quizzes().find((q) => q.id === this.quizId);
}
