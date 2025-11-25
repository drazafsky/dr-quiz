import { Component, inject, Signal, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../lib/components/card/card';
import { ToolbarComponent } from '../../lib/components/toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TestStore } from '../../lib/stores/test.store';
import { formatDuration as calcDuration } from '../../lib/utils/format-duration';
import { QuizStore } from '../../lib/stores/quiz.store';
import { computed } from '@angular/core';
import { Test } from '../../lib/types/test';
import { Quiz } from '../../lib/types/quiz';
import { DialogComponent } from "../../lib/components/dialog/dialog";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizWithRelatedQuestions, TestService } from './test-service';
import { QuestionStore } from '../../lib/stores/question.store';
import { AnswerStore } from '../../lib/stores/answer.store';

interface TestWithRelatedQuiz extends Test {
  quiz: Quiz;
  timeRemaining: Signal<string>;
}

@Component({
  selector: 'app-test-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ToolbarComponent, DialogComponent, ReactiveFormsModule],
  templateUrl: './test-list-page.html',
  providers: [AnswerStore, QuestionStore, QuizStore, TestService, TestStore],
})
export class TestListPage {
  readonly #testStore = inject(TestStore);
  readonly #quizStore = inject(QuizStore);
  readonly #questionStore = inject(QuestionStore);
  readonly #testService = inject(TestService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #fb = inject(FormBuilder);

  readonly #selectedQuiz$ = this.#quizStore.selectedQuiz;
  readonly #selectedQuizQuestions$ = this.#questionStore.quizQuestions;
  readonly publishedQuizzes$ = this.#quizStore.publishedQuizzes;

  currentTime = signal(Date.now());

  constructor() {
    effect(() => {
      const interval = setInterval(() => {
        this.currentTime.set(Date.now());
      }, 1000);

      return () => clearInterval(interval);
    });
  }

  tests$: Signal<TestWithRelatedQuiz[]> = computed(() => {
    const tests = this.#testStore.tests();
    const quizzes = this.publishedQuizzes$();

    return tests.map(test => ({
      ...test,
      quiz: quizzes.find(quiz => quiz.id === test.quizId),
      timeRemaining: computed(() => {
        if (test.deadLine) {
          const deadlineTime = new Date(test.deadLine).getTime();
          return this.formatDuration(Math.max(0, (deadlineTime - this.currentTime()) / 1000));
        }
        return 0;
      }),
    }) as TestWithRelatedQuiz);
  });

  form = this.#fb.group({
    selectedQuizId: ['', Validators.required],
  });

  isDialogOpen = false;

  handleNew() {
    this.isDialogOpen = true;
  }

  handleDialogSave() {
    const formValue = this.form.value;

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    if (formValue.selectedQuizId ) {
        const quizId = formValue.selectedQuizId;

        this.#quizStore.selectQuiz(quizId);
        this.#questionStore.setQuizId(quizId);

        const quiz = this.#selectedQuiz$();

        if (quiz && quiz.isPublished) {
          const formTest: Test = {
            id: '',
            quizId,
            questions: [],
            selectedAnswers: [],
            isSubmitted: false,
            deadLine: new Date(),
            score: {
              correct: 0,
              incorrect: 0,
              points: 0,
              percent: 0
            },
          };

          const quizWithQuestions: QuizWithRelatedQuestions = {
            ...quiz,
            questions: this.#selectedQuizQuestions$(),
          }

          const newTest: Test = this.#testService.convertToTestDTO(formTest, quizWithQuestions);

          this.#testStore.saveTest(newTest);
        }
    }

    this.isDialogOpen = false;
  }

  handleDialogCancel() {
    this.isDialogOpen = false;
  }

  handleEdit(test: Test) {
    this.#router.navigate([test.id], { relativeTo: this.#route });
  }

  handleDelete(test: Test) {
    this.#testStore.deleteTest(test);
  }

  handlePublish(test: Test) {
    this.#testStore.publish(test);
  }

  formatDuration(seconds: number): string {
    return calcDuration(seconds);
  }
}
