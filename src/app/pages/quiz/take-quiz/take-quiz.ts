import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, ReactiveFormsModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TakeQuizService } from './take-quiz-service';
import { combineLatest, map } from 'rxjs';
import { QuizStore } from '../quiz.store';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-take-quiz',
  imports: [AsyncPipe, JsonPipe, ReactiveFormsModule],
  providers: [QuizStore, TakeQuizService],
  templateUrl: './take-quiz.html',
  styleUrl: './take-quiz.scss',
})
export class TakeQuiz {
  readonly #formBuilder = inject(FormBuilder);
  readonly #takeQuizService = inject(TakeQuizService);

  readonly #form = this.#formBuilder.group({
    questions: this.#formBuilder.array([]),
  });

  get questions(): FormArray {
    return this.#form.get('questions') as FormArray;
  }

  constructor() {
    this.vm$.subscribe(({ quiz }) => {
      if (quiz) {
        this.questions.clear();
        quiz.questions.forEach((question) => {
          const questionGroup = this.#formBuilder.group({
            selectedAnswer: [''],
          });
          this.questions.push(questionGroup);
        });
      }
    });
  }

  vm$ = combineLatest([
    toObservable(this.#takeQuizService.quiz$),
  ]).pipe(
    map(([ quiz ]) => ({
      quiz,
    }))
  );
}
