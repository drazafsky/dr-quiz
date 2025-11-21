import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStore } from '../../../lib/stores/quiz.store';

@Component({
  selector: 'app-quiz-list-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold">Quiz List</h1>
      <ul class="mt-4">
        <li *ngFor="let quiz of quizzes">
          {{ quiz.title }} - {{ quiz.description }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .p-4 {
      padding: 1rem;
    }
    .text-2xl {
      font-size: 1.5rem;
    }
    .font-bold {
      font-weight: bold;
    }
    .mt-4 {
      margin-top: 1rem;
    }
  `]
})
export class QuizListPage {
  quizzes = this.quizStore.state.quizzes();

  constructor(private quizStore: ReturnType<typeof QuizStore>) {}
}
