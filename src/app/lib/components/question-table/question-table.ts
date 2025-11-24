import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionStore } from '../../stores/question.store';
import { Question } from '../../types/question';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerStore } from '../../stores/answer.store';
import { Answer } from '../../types/answer';

@Component({
  selector: 'app-question-table',
  standalone: true,
  imports: [CommonModule],
  providers: [AnswerStore, QuestionStore],
  templateUrl: './question-table.html',
})
export class QuestionTableComponent {
  readonly #questionStore = inject(QuestionStore);
  readonly #answerStore = inject(AnswerStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  quizId = input.required<string | undefined>();
  processing = input.required<boolean>();
  isPublished = input.required<boolean>();

  questions$ = this.#questionStore.quizQuestions;

  constructor() {
    effect(() => {
      const quizId = this.quizId();
      this.#questionStore.setQuizId(quizId);
    })
  }

  correctAnswer(question: Question) {
    return this.#answerStore.selectById(question.correctAnswer);
  }

  handleEditQuestion(question: Question): void {
    this.#router.navigate(['question', question.id], { relativeTo: this.#route });
  }

  handleDeleteQuestion(question: Question): void {
    this.#questionStore.deleteQuestion(question);
  }
}

