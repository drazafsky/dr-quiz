import { Component, effect, inject, input } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { QuestionStore } from '../../stores/question.store';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  providers: [QuestionStore],
  templateUrl: './question-table.html',
})
export class QuestionTableComponent {
  readonly #questionStore = inject(QuestionStore);

  questionIds = input.required<string[] | undefined>();
  questions$ = this.#questionStore.filteredQuestions;

  constructor() {
    effect(() => {
      const questionIds = this.questionIds();
      this.#questionStore.filter(questionIds);
    });
  }
}
