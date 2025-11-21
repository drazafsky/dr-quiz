import { Component, computed, effect, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TakeQuizService } from './take-quiz-service';
import { combineLatest, map, of, filter, interval, Subscription } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { QuizStore } from '../quiz.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Question } from '../types/question';
import { TestStore } from '../test.store';
import { Test } from '../types/test';

@Component({
  selector: 'app-take-quiz',
  imports: [AsyncPipe, ReactiveFormsModule],
  providers: [QuizStore, TestStore, TakeQuizService],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.scss',
})
export class TakeQuiz {
  readonly #router = inject(Router);
  readonly #formBuilder = inject(FormBuilder);
  readonly #takeQuizService = inject(TakeQuizService);

  #startTime: number = 0; 

  readonly maxScore$ = computed(() => {
    return this.#takeQuizService.quiz$()?.questions.reduce((sum, question) => sum + question.pointValue, 0) || 0;
  });

  readonly scorePercent$ = computed(() => {
    const maxScore = this.maxScore$();
    const test = this.#takeQuizService.test$();

    return Math.floor(((test?.score || 0) / (maxScore || 1)) * 100);
  });

  private timerSubscription: Subscription | null = null;

  readonly #form = this.#formBuilder.group({
    id: ['', Validators.required],
    questions: this.#formBuilder.array([
      this.#formBuilder.group({
        id: [''],
        answer: ['']
      })
    ]),
    isSubmitted: [false],
    timeTaken: [0],
    score: [0],
  });

  vm$ = combineLatest([
    toObservable(this.#takeQuizService.quiz$),
    toObservable(this.#takeQuizService.test$),
    of(this.#form),
  ]).pipe(
    map(([ quiz, test, form ]) => ({
      quiz,
      test,
      form,
    }))
  );

  get elapsedTime(): number {
    const endTime = Date.now();
    return Math.floor((endTime - this.#startTime) / 1000);
  }

  constructor() {
    effect(() => {
      const quiz = this.#takeQuizService.quiz$();
      const test = this.#takeQuizService.test$();

      if (quiz) {
        // Populate the form controls with values from the quiz and any saved answers
        this.#form.get('id')?.setValue(quiz.id || null);
        (this.#form.get('questions') as FormArray).clear();
        quiz.questions.forEach(question => this.addQuestion(question));
      }

      if (test) {
        this.#startTime = this.#startTime > 0 ? this.#startTime : new Date((new Date()).getTime() - (test.timeTaken * 1000)).getTime();
        this.#form.patchValue(test);
      }
    });

    this.#router.events.pipe(
      takeUntilDestroyed(),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.#startTime = Date.now();
    });

    this.#router.events.pipe(
      takeUntilDestroyed(),
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      if (!this.#takeQuizService.test$()?.isSubmitted) {
        const test = this.#form.value as Test;
        test.timeTaken = (test.timeTaken || 0) + this.elapsedTime;
        this.#takeQuizService.save(test);
      }
    });

    this.startTimer();
  }

  private startTimer() {
    this.timerSubscription?.unsubscribe(); // Clear any existing timer
    this.timerSubscription = interval(1000)
    .subscribe(() => {
      const elapsedTime = this.elapsedTime;
      const test = this.#takeQuizService.test$();
      const quiz = this.#takeQuizService.quiz$();

      const testTimeTakePreviously = test?.timeTaken || 0;

      if (quiz && (elapsedTime + testTimeTakePreviously) >= quiz.timeLimit) {
        this.handleSubmit();
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe(); // Clean up the timer when the component is destroyed 
  }

  private addQuestion(question: Question) {
    const questionControls = this.#formBuilder.group({
      id: [question?.id, Validators.required],
      answer: [null, question.required ? Validators.required : undefined],
    });

    (this.#form.get('questions') as FormArray).push(questionControls);
  }

  handleSave() {
    const test = this.#form.value as Test;
    test.timeTaken = test.timeTaken + this.elapsedTime;
    this.#takeQuizService.save(test);
  }

  handleSubmit() {
    const test = this.#form.value as Test;
    test.timeTaken = (test.timeTaken || 0) + this.elapsedTime;
    this.#takeQuizService.submit(test);
  }

  isQuestionCorrect(question: Question): boolean {
    const test = this.#takeQuizService.test$();
    const testQuestion = test?.questions.find(tq => tq.id === question.id);

    if (testQuestion) {
      return this.#takeQuizService.isAnswerCorrect(testQuestion?.id, testQuestion?.answer);
    }

    return false;
  }

  isAnswerCorrect(question: Question, answerId: string): boolean {
    return question.answers.filter(answer => answer.id === answerId && answer.isCorrect).length > 0;
  }
}
