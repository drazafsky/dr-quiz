import { Component, effect, inject } from '@angular/core';
import { QuizDetailsPageService } from './quiz-details-page-service';
import { BehaviorSubject, combineLatest, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizStore } from '../quiz.store';
import { Question } from '../types/question';
import { Answer } from '../types/answer';
import { Quiz } from '../types/quiz';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

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

  readonly #form = this.#formBuilder.group({
    id: [''],
    title: ['', Validators.required],
    description: [''],
    timeLimit: [60, Validators.required],
    shuffleQuestions: [false, Validators.required],
    questions: this.#formBuilder.array([])
  });

  vm$ = combineLatest([
    toObservable(this.#quizDetailsService.quiz$),
    of(this.#form),
    this.#quizDetailsService.quizId$.asObservable(),
  ]).pipe(
    map(([ quiz, form, _quizId ]) => ({
      quiz,
      form,
    }))
  );

  get questions(): FormArray {
    return this.#form.get('questions') as FormArray;
  }

  constructor() {
    effect(() => {
      const quiz = this.#quizDetailsService.quiz$();
      if (quiz) {
        // Populate the form controls with values from the quiz
        this.#form.get('id')?.setValue(quiz.id || null);
        this.#form.get('title')?.setValue(quiz.title);
        this.#form.get('description')?.setValue(quiz.description);
        this.#form.get('timeLimit')?.setValue(quiz.timeLimit);
        this.#form.get('shuffleQuestions')?.setValue(quiz.shuffleQuestions);

        if (quiz.isPublished) {
          this.#form.get('title')?.disable();
          this.#form.get('description')?.disable();
          this.#form.get('timeLimit')?.disable();
          this.#form.get('shuffleQuestions')?.disable();
        }

        (this.#form.get('questions') as FormArray).clear();
        quiz.questions.forEach(question => this.addQuestion(question, quiz.isPublished));
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
    this.#quizDetailsService.publish(this.#form.value as Quiz)
  }

  handleDelete() {
    console.log('Deleting...');
  }

  private addQuestion(question?: Question, disableControls?: boolean) {
    const questionControls = this.#formBuilder.group({
      required: [question?.required || false, Validators.required],
      pointValue: [question?.pointValue || 1, Validators.required],
      prompt: [question?.prompt || '', Validators.required],
      answers: this.#formBuilder.array([])
    });

    if (disableControls) {
      questionControls.get('required')?.disable();
      questionControls.get('pointValue')?.disable();
      questionControls.get('prompt')?.disable();
    }

    if (question?.answers.length) {
      const answerControls = question.answers.map(answer => this.addAnswer(answer, disableControls));
      (questionControls.get('answers') as FormArray).push(answerControls);
    } else {
      const answerControls = this.addAnswer(undefined, disableControls);

      (questionControls.get('answers') as FormArray).push(answerControls);
    }

    (this.#form.get('questions') as FormArray).push(questionControls);
  }

  private addAnswer(answer?: Answer, disableControls?: boolean) {
    let answerControls: FormGroup;
    if (answer) {
      answerControls = this.#formBuilder.group({
        value: [answer.value, Validators.required],
        isCorrect: [answer.isCorrect, Validators.required]
      });
    } else {
      answerControls = this.#formBuilder.group({
          value: ['', Validators.required],
          isCorrect: [false, Validators.required]
        });
      }

      if (disableControls) {
        answerControls.get('value')?.disable();
        answerControls.get('isCorrect')?.disable();
      }

      return answerControls;
  }
}
