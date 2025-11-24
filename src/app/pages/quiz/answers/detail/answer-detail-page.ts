import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerStore } from '../../../../lib/stores/answer.store';
import { notEmptyValidator } from '../../../../lib/validators/not-empty.validator';
import { CardComponent } from "../../../../lib/components/card/card";
import { ToolbarComponent } from "../../../../lib/components/toolbar/toolbar.component";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AnswerService } from '../answer-service';

@Component({
  selector: 'app-answer-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ToolbarComponent
  ],
  templateUrl: './answer-detail-page.html',
  providers: [AnswerService, AnswerStore],
})
export class AnswerDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #answerStore = inject(AnswerStore);
  readonly #answerService = inject(AnswerService);
  readonly #fb = inject(FormBuilder);

  #answerId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('answerId')),
    filter(answerId => answerId !== null)
  ));

  #questionId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('questionId')),
    filter(questionId => questionId !== null)
  ));

  questionAnswers$ = this.#answerStore.questionAnswers;
  selectedAnswer$ = this.#answerStore.selectedAnswer;
  processing$ = this.#answerStore.loading;
  saveStatus$ = this.#answerStore.save;

  form: FormGroup = this.#fb.group({
    value: ['', [Validators.required, notEmptyValidator()]],
  });

  constructor() {
    const answer = this.#answerStore.answers().find((a) => a.id === this.#answerId$());

    if (answer) {
      this.form.patchValue(answer);
    }

    effect(() => {
      const questionId = this.#questionId$();
      this.#answerStore.setQuestionId(questionId);
    });

    effect(() => {
      const selectedAnswerId = this.#answerId$();
      this.#answerStore.selectAnswer(selectedAnswerId);
    });

    effect(() => {
      // Redirect to the same page with the updated answerId parameter whenever it changes
      const selectedAnswerId = this.#answerStore.selectedAnswerId();
      const urlAnswerId = this.#answerId$();

      if (selectedAnswerId !== urlAnswerId) {
        this.#router.navigate(['../', selectedAnswerId], { relativeTo: this.#route });
      }
    });
  }

  handleSaveAnswer() { 
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const updatedAnswer = this.#answerService.convertToAnswerDTO({
      ...this.form.value,
      id: this.#answerId$(),
      questionId: this.#questionId$()
    });

    this.#answerStore.saveAnswer(updatedAnswer);
  }
}
