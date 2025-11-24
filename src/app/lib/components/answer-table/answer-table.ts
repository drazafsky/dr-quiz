import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../../types/answer';
import { AnswerStore } from '../../stores/answer.store';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-answer-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-table.html',
  providers: [
    AnswerStore,
  ]
})
export class AnswerTableComponent {
  readonly #answerStore = inject(AnswerStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  questionId = input.required<string | undefined>();
  processing = input.required<boolean>();
  isPublished = input.required<boolean>();

  answers$ = this.#answerStore.answers;

  constructor() {
    effect(() => {
      const questionId = this.questionId();
      this.#answerStore.setQuestionId(questionId);
    })
  }

  handleEditAnswer(answer: Answer): void {
    this.#router.navigate(['answer', answer.id], { relativeTo: this.#route });
  }

  handleDeleteAnswer(answer: Answer): void {
    this.#answerStore.deleteAnswer(answer);
  }
}
