import { Component, effect, inject, signal } from '@angular/core';
import { QuizDetailsPageService } from './quiz-details-page-service';
import { combineLatest, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../types/question';
import { Answer } from '../types/answer';
import { Quiz } from '../types/quiz';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { notEmptyValidator } from '../../../lib/validators/not-empty.validator';
import { QuizStore } from '../../../lib/stores/quiz.store';

@Component({
  selector: 'app-quiz-details-page',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './quiz-details-page.html',
  styleUrl: './quiz-details-page.scss',
  providers: [QuizStore, QuizDetailsPageService],
})
export class QuizDetailsPage {
  readonly #quizDetailsService = inject(QuizDetailsPageService); 
  readonly #formBuilder = inject(FormBuilder);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);

  readonly #displayErrors$ = signal<boolean>(false);

  readonly #form = this.#formBuilder.group({
    id: [''],
    title: ['', [Validators.required, notEmptyValidator()]],
    description: [''],
    timeLimit: [60, [Validators.required, Validators.min(1)]],
    shuffleQuestions: [false, Validators.required],
    questions: this.#formBuilder.array([])
  });

  vm$ = combineLatest([
    toObservable(this.#quizDetailsService.quiz$),
    of(this.#form),
    this.#quizDetailsService.quizId$.asObservable(),
    toObservable(this.#displayErrors$),
  ]).pipe(
    map(([ quiz, form, _quizId, displayErrors ]) => ({
      quiz,
      form,
      displayErrors,
    }))
  );

  get questions(): FormArray {
    return this.#form.get('questions') as FormArray;
  }

  constructor() {
    effect(() => {
      const quiz = this.#quizDetailsService.quiz$();

      if (quiz) {
        (this.#form.get('questions') as FormArray).clear();
        quiz.questions.forEach(question => this.addQuestion(question));

        // Populate the form controls with values from the quiz
        this.#form.patchValue(quiz);

        if (quiz.isPublished) {
          this.#form.disable();
        }
      }
    });

    effect(() => {
      const quiz = this.#quizDetailsService.quiz$();
      if (!!quiz?.id && quiz?.id !== 'create' && quiz?.id !== this.#quizDetailsService.quizId$.value) {
        this.#router.navigate(['..', quiz?.id], { relativeTo: this.#route });
      }
    })
  }

  answers(question: AbstractControl): FormArray {
    return question.get('answers') as FormArray;
  }

  handleAddAnswer(question: AbstractControl) {
    const answerControls = this.addAnswer();
    (question.get('answers') as FormArray).push(answerControls);
  }

  handleDeleteAnswer(question: AbstractControl, index: number) {
    (question.get('answers') as FormArray).removeAt(index);
  }

  handleAddQuestion() {
    this.addQuestion();
  }

  handleSave() { 
    this.#quizDetailsService.save(this.#form.value as Quiz)
  }

  handlePublish() {
    if (this.#form.invalid) {
      this.#displayErrors$.set(true);
      return;
    }

    this.#quizDetailsService.publish(this.#form.value as Quiz)
  }

  private addQuestion(question?: Question) {
    const questionControls = this.#formBuilder.group({
      id: [question?.id || uuidv4(), Validators.required],
      required: [false, Validators.required],
      pointValue: [1, [Validators.required, Validators.min(0)]],
      prompt: ['', [Validators.required, notEmptyValidator()]],
      answers: this.#formBuilder.array([])
    });

    if (question?.answers.length) {
      const answerControls = question.answers.map(() => this.addAnswer());
      (questionControls.get('answers') as FormArray).push(answerControls);
    } else {
      const answerControls = this.addAnswer();

      (questionControls.get('answers') as FormArray).push(answerControls);
    }

    (this.#form.get('questions') as FormArray).push(questionControls);
  }

  private addAnswer() {
    let answerControls: FormGroup;
    answerControls = this.#formBuilder.group({
      id: [uuidv4(), Validators.required],
      value: ['', [Validators.required, notEmptyValidator()]],
      isCorrect: [false, Validators.required]
    });

    return answerControls;
  }
}
