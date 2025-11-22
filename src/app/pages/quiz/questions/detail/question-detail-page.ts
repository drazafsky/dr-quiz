import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionStore } from '../../../../lib/stores/question.store';
import { notEmptyValidator } from '../../../../lib/validators/not-empty.validator';

@Component({
  selector: 'app-question-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-detail-page.html',
  providers: [QuestionStore],
})
export class QuestionDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #questionStore = inject(QuestionStore);
  readonly #fb = inject(FormBuilder);

  questionId = this.#route.snapshot.paramMap.get('questionId');
  quizId = this.#route.snapshot.paramMap.get('quizId');

  form: FormGroup = this.#fb.group({
    prompt: ['', [Validators.required, notEmptyValidator()]],
    pointValue: [0, [Validators.min(1)]],
    required: [false],
    correctAnswer: ['', Validators.required],
    answers: this.#fb.array([]),
  });

  constructor() {
    const question = this.#questionStore.state.questions().find((q) => q.id === this.questionId);
    if (question) {
      this.form.patchValue(question);
    }
  }

  handleSave() {
    if (this.form.valid) {
      const updatedQuestion = { ...this.form.value, id: this.questionId };
      this.#questionStore.saveQuestion(updatedQuestion);
    }
  }
}
