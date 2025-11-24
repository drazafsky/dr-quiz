import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionStore } from '../../../../lib/stores/question.store';
import { notEmptyValidator } from '../../../../lib/validators/not-empty.validator';
import { CardComponent } from "../../../../lib/components/card/card";
import { ToolbarComponent } from "../../../../lib/components/toolbar/toolbar.component";
import { QuestionService } from '../question-service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AnswerTableComponent } from '../../../../lib/components/answer-table/answer-table';
import { QuizStore } from '../../../../lib/stores/quiz.store';

@Component({
  selector: 'app-question-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ToolbarComponent,
    AnswerTableComponent
  ],
  templateUrl: './question-detail-page.html',
  providers: [QuestionService, QuestionStore, QuizStore],
})
export class QuestionDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #questionStore = inject(QuestionStore);
  readonly #quizStore = inject(QuizStore);
  readonly #fb = inject(FormBuilder);
  readonly #questionService = inject(QuestionService);

  #questionId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('questionId')),
    filter(quizId => quizId !== null)
  ));

  #quizId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('quizId')),
    filter(quizId => quizId !== null)
  ));

  quiz$ = this.#quizStore.selectedQuiz;
  question$ = this.#questionStore.selectedQuestion;
  processing$ = this.#questionStore.loading;
  saveStatus$ = this.#questionStore.save;

  form: FormGroup = this.#fb.group({
    prompt: ['', [Validators.required, notEmptyValidator()]],
    pointValue: [1, [Validators.min(1)]],
    required: [false],
  });

  constructor() {
    const question = this.#questionStore.questions().find((q) => q.id === this.#questionId$());

    if (question) {
      this.form.patchValue(question);
    }

    effect(() => {
      const quizId = this.#quizId$();
      this.#quizStore.selectQuiz(quizId);
    });

    effect(() => {
      const selectedQuestionId = this.#questionId$();
      this.#questionStore.selectQuestion(selectedQuestionId);
    });

    effect(() => {
      // If the id of the question has changed (should only happen when saving a new question), redirect
      // to the same page with the correct question id in the url
      const selectedQuestionId = this.#questionStore.selectedQuestionId();
      const urlQuestionId = this.#questionId$();

      if (selectedQuestionId !== urlQuestionId) {
        this.#router.navigate(['..', selectedQuestionId], { relativeTo: this.#route });
      }
    });
  }

  handleSaveQuestion() { 
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const updatedQuestion = this.#questionService.convertToQuestionDTO({
      ...this.form.value,
      id: this.#questionId$(),
      quizId: this.#quizId$()
    });

    this.#questionStore.saveQuestion(updatedQuestion);
  }

  handleCreateAnswer() {
    this.#router.navigate(['answer', 'create'], { relativeTo: this.#route });
  }
}
