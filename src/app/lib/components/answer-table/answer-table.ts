import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../../types/answer';
import { AnswerStore } from '../../stores/answer.store';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionStore } from '../../stores/question.store';

@Component({
  selector: 'app-answer-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-table.html',
  providers: [
    AnswerStore,
    QuestionStore,
  ]
})
export class AnswerTableComponent {
  readonly #answerStore = inject(AnswerStore);
  readonly #questionStore = inject(QuestionStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  questionId = input.required<string>();
  processing = input.required<boolean>();
  isPublished = input.required<boolean>();

  answers$ = this.#answerStore.questionAnswers;

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

  handleMarkCorrectAnswer(questionId: string, answer: Answer) {
    this.#questionStore.markAsAnswer(questionId, answer);
  }
}
