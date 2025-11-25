import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { CardComponent } from '../../../lib/components/card/card';
import { ToolbarComponent } from '../../../lib/components/toolbar/toolbar.component';
import { TestStore } from '../../../lib/stores/test.store';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { QuestionStore } from '../../../lib/stores/question.store';
import { AnswerStore } from '../../../lib/stores/answer.store';
import { notEmptyValidator } from '../../../lib/validators/not-empty.validator';
import { TestService } from '../test-service';

@Component({
  selector: 'app-test-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ToolbarComponent,
  ],
  templateUrl: './test-detail-page.html',
  providers: [AnswerStore, QuestionStore, QuizStore, TestService, TestStore],
})
export class TestDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #testStore = inject(TestStore);
  readonly #questionStore = inject(QuestionStore);
  readonly #quizStore = inject(QuizStore);
  readonly #testService = inject(TestService);
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
  readonly currentAnswers$ = this.#testStore.nextUnansweredQuestionsAnswers;
  readonly lastQuestion$ = this.#testStore.previousQuestion;
  readonly lastQuestionAnswers$ = this.#testStore.previousQuestionAnswers;
  readonly lastQuestionSubmittedAnswer$ = this.#testStore.previousQuestionSubmittedAnswer;

  readonly testCompleted = computed(() => {
    const test = this.test$();
    return test?.questions.length === test?.selectedAnswers.length;
  });

  showResults = false; 

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
    selectedAnswer: ['', [Validators.required, notEmptyValidator()]]
  });

  handleSubmitAnswer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const test = this.test$();
    const selectedAnswerId = this.form.value.selectedAnswer;

    if (test !== undefined) {
      const updatedTest = this.#testService.addAnswer(test, selectedAnswerId);
      this.#testStore.saveTest(updatedTest);
    }

    this.showResults = true;
  }

  handleNextQuestion() {
    this.showResults = false;
    this.form.reset();
  } 
}
