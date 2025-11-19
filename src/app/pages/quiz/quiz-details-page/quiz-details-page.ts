import { Component, inject } from '@angular/core';
import { QuizDetailsPageService } from './quiz-details-page-service';
import { combineLatest, filter, map, of, tap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuizStore } from '../quiz.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz-details-page',
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
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
        return this.#quizDetailsService.getById(parseInt(quizId));
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
        //this.#form.get('questions')?.setValue(quiz.questions);
      }
    })
  );

  readonly #form = this.#formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    timeLimit: [60, Validators.required],
    shuffleQuestions: [false, Validators.required],
    questions: this.#formBuilder.array([
      this.#formBuilder.array([
        this.#formBuilder.control('')
      ])
    ])
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

  handleSave() {
    console.log('Saving...');
  }

  handlePublish() {
    console.log('Publishing...');
  }

  handleDelete() {
    console.log('Deleting...');
  }
}
