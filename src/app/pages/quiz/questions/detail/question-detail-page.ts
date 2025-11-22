import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionStore } from '../../../../lib/stores/question.store';
import { notEmptyValidator } from '../../../../lib/validators/not-empty.validator';
import { CardComponent } from "../../../../lib/components/card/card";
import { ToolbarComponent } from "../../../../lib/components/toolbar/toolbar.component";
import { Question } from '../../../../lib/types/question';

@Component({
  selector: 'app-question-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ToolbarComponent],
  templateUrl: './question-detail-page.html',
  providers: [QuestionStore],
})
export class QuestionDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #questionStore = inject(QuestionStore);
  readonly #fb = inject(FormBuilder);

  questionId = this.#route.snapshot.paramMap.get('questionId');
  quizId = this.#route.snapshot.paramMap.get('quizId');

  question$ = this.#questionStore.selectedQuestion;
  processing$ = this.#questionStore.loading;

  form: FormGroup = this.#fb.group({
    prompt: ['', [Validators.required, notEmptyValidator()]],
    pointValue: [0, [Validators.min(1)]],
    required: [false],
  });

  constructor() {
    const question = this.#questionStore.questions().find((q) => q.id === this.questionId);
    if (question) {
      this.form.patchValue(question);
    }
  }

  handleSaveQuestion() { 
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const updatedQuestion = { ...this.form.value, id: this.questionId } as Question;
    this.#questionStore.saveQuestion(updatedQuestion);
  }
}
