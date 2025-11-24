import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { CardComponent } from '../../../lib/components/card/card';
import { ToolbarComponent } from '../../../lib/components/toolbar/toolbar.component';
import { TestStore } from '../../../lib/stores/test.store';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { QuestionStore } from '../../../lib/stores/question.store';

@Component({
  selector: 'app-test-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ToolbarComponent,
    JsonPipe,
  ],
  templateUrl: './test-detail-page.html',
  providers: [QuestionStore, QuizStore, TestStore],
})
export class TestDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #testStore = inject(TestStore);
  readonly #questionStore = inject(QuestionStore);
  readonly #quizStore = inject(QuizStore);
  readonly #fb = inject(FormBuilder);

  readonly #testId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('testId')),
    filter(testId => testId !== null)
  ));

  readonly test$ = this.#testStore.selectedTest; 
  readonly quiz$ = this.#quizStore.selectedQuiz;
  readonly questions$ = this.#questionStore.quizQuestions;

  readonly currentQuestion$ = this.#testStore.nextUnasweredQuestion;

  constructor() {
    effect(() => {
      const selectedTestId = this.#testId$();
      this.#testStore.selectTest(selectedTestId);
    });

    effect(() => {
      const test = this.test$(); 
      this.#quizStore.selectQuiz(test?.quizId);
      this.#questionStore.setQuizId(test?.quizId);
    });
  }
  readonly processing$ = this.#testStore.loading;
  readonly saveStatus$ = this.#testStore.save;

  form: FormGroup = this.#fb.group({
    isSubmitted: [false],
  });

  handleSaveTest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const updatedTest = {
      ...this.form.value,
      id: this.#testId$(),
    };

    this.#testStore.saveTest(updatedTest);
  }
}
