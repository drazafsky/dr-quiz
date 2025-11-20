import { Component, inject } from '@angular/core';
import { QuizDetailsPageService } from './quiz-details-page-service';
import { combineLatest, filter, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizStore } from '../quiz.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Question } from '../types/question';
import { Answer } from '../types/answer';
import { Quiz } from '../types/quiz';

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

  #quiz$ = this.#quizDetailsService.quizId$
  .pipe(
    takeUntilDestroyed(),
    filter(quizId => quizId !== null),
    map(quizId => {
      if (quizId !== 'create') {
        return this.#quizDetailsService.getById(quizId);
      }
      
      return this.#quizDetailsService.getNew();
    }),
    tap(quiz => {
      if (quiz) {
        // Populate the form controls with values from the quiz
        this.#form.get('title')?.setValue(quiz.title);
        this.#form.get('description')?.setValue(quiz.description);
        this.#form.get('timeLimit')?.setValue(quiz.timeLimit);
        this.#form.get('shuffleQuestions')?.setValue(quiz.shuffleQuestions);

        quiz.questions.forEach(question => this.addQuestion(question));
      }
    })
  );

  readonly #form = this.#formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    timeLimit: [60, Validators.required],
    shuffleQuestions: [false, Validators.required],
    questions: this.#formBuilder.array([])
  });

  vm$ = combineLatest([
    this.#quiz$,
    this.#quizDetailsService.isLoading$,
    of(this.#form),
  ]).pipe(
    map(([ quiz, isLoading, form ]) => ({
      quiz,
      isLoading,
      form
    }))
  );

  get questions(): FormArray {
    return this.#form.get('questions') as FormArray;
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
    console.log('Publishing...');
  }

  handleDelete() {
    console.log('Deleting...');
  }

  private addQuestion(question?: Question) {
    const questionControls = this.#formBuilder.group({
      required: [question?.required || false, Validators.required],
      pointValue: [question?.pointValue || 1, Validators.required],
      prompt: [question?.prompt || '', Validators.required],
      answers: this.#formBuilder.array([])
    });

    if (question?.answers.length) {
      const answerControls = question.answers.map(answer => this.addAnswer(answer));
      (questionControls.get('answers') as FormArray).push(answerControls);
    } else {
      const answerControls = this.addAnswer();

      (questionControls.get('answers') as FormArray).push(answerControls);
    }

    (this.#form.get('questions') as FormArray).push(questionControls);
  }

  private addAnswer(answer?: Answer) {
    if (answer) {
      return this.#formBuilder.group({
        value: [answer.value, Validators.required],
        isCorrect: [answer.isCorrect, Validators.required]
      });
    }

    return this.#formBuilder.group({
        value: ['', Validators.required],
        isCorrect: [false, Validators.required]
      });
  }
}
