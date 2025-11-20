import { Component, effect, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TakeQuizService } from './take-quiz-service';
import { combineLatest, map, of, filter } from 'rxjs';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { QuizStore } from '../quiz.store';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Question } from '../types/question';
import { Answer } from '../types/answer';
import { TestStore } from '../test.store';
import { Test } from '../types/test';

@Component({
  selector: 'app-take-quiz',
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
  providers: [QuizStore, TestStore, TakeQuizService],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.scss',
})
export class TakeQuiz {
  readonly #router = inject(Router);
  readonly #formBuilder = inject(FormBuilder);
  readonly #takeQuizService = inject(TakeQuizService);

  #startTime: number = 0;
  #endTime: number = 0;

  readonly #form = this.#formBuilder.group({
    id: ['', Validators.required],
    timeTaken: [0],
    questions: this.#formBuilder.array([])
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

  constructor() {
    effect(() => {
      const quiz = this.#takeQuizService.quiz$();
      const test = this.#takeQuizService.test$();

      if (quiz) {
        // Populate the form controls with values from the quiz
        this.#form.get('id')?.setValue(quiz.id || null);
        (this.#form.get('questions') as FormArray).clear();
        quiz.questions.forEach(question => this.addQuestion(question));
      }

      if (test) {
        this.#form.get('timeTaken')?.setValue(test.timeTaken || 0);
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
      this.#endTime = Date.now();
      const elapsedTime = Math.floor((this.#endTime - this.#startTime) / 1000);

      const test = this.#form.value as Test;
      test.timeTaken = (test.timeTaken || 0) + elapsedTime;

      this.#takeQuizService.save(test);
    });
  }

  get questions(): FormArray {
    return this.#form.get('questions') as FormArray;
  }

  answers(question: AbstractControl): FormArray {
    return question.get('answers') as FormArray;
  }

  private addQuestion(question: Question) {
    const questionControls = this.#formBuilder.group({
      required: [question?.required || false, Validators.required],
      pointValue: [question?.pointValue || 1, Validators.required],
      prompt: [question?.prompt || '', Validators.required],
      answers: this.#formBuilder.array([]),
      selectedAnswer: ['', question.required ? Validators.required : undefined],
    });

    if (question.answers.length) {
      const answerControls = question.answers.map(answer => this.addAnswer(answer));
      (questionControls.get('answers') as FormArray).push(answerControls);
    }

    (this.#form.get('questions') as FormArray).push(questionControls);
  }

  private addAnswer(answer: Answer) {
    let answerControls: FormGroup;
      answerControls = this.#formBuilder.group({
        value: [answer.value, Validators.required],
        isCorrect: [answer.isCorrect, Validators.required]
      });

      return answerControls;
  } 

  handleSave() {
    const test = this.#form.value as Test;
    this.#takeQuizService.save(test);
  }

  handleSubmit() {
    const test = this.#form.value as Test;
    this.#takeQuizService.submit(test);
  }
}
