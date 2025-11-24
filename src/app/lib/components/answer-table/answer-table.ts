import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../../types/answer';
import { AnswerRepo } from '../../repos/answer-repo';

@Component({
  selector: 'app-answer-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-table.html',
})
export class AnswerTableComponent {
  readonly #answerRepo = inject(AnswerRepo);

  answers: Answer[] = this.#answerRepo.getItem() || [];

  handleDeleteAnswer(answer: Answer): void {
    this.answers = this.answers.filter(a => a !== answer);
    this.#answerRepo.setItem(this.answers);
  }
}
