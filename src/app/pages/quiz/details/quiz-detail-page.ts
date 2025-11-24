import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { CardComponent } from "../../../lib/components/card/card";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notEmptyValidator } from '../../../lib/validators/not-empty.validator';
import { ToolbarComponent } from "../../../lib/components/toolbar/toolbar.component";
import { QuestionTableComponent } from "../../../lib/components/question-table/question-table";

@Component({
  selector: 'app-quiz-detail-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, ToolbarComponent, QuestionTableComponent],
  templateUrl: './quiz-detail-page.html',
  providers: [QuizStore],
})
export class QuizDetailPage {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);
  readonly #fb = inject(FormBuilder); 

  readonly #quizId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('quizId')),
    tap(quizId => this.#quizStore.selectQuiz(quizId ? quizId : undefined))
  ));

  quiz$ = this.#quizStore.selectedQuiz;
  processing$ = this.#quizStore.loading;
  saveStatus$ = this.#quizStore.save;

  form: FormGroup = this.#fb.group({
    title: ['', [Validators.required, notEmptyValidator()]],
    description: [''],
    timeLimit: [0, [Validators.min(1)]],
    shuffleQuestions: [false, Validators.required],
  });

  constructor() {
    effect(() => {
      const quiz = this.quiz$();

      if (quiz !== undefined) {
        this.form.patchValue(quiz);

        if (quiz.isPublished) {
          this.form.disable();
        }
      }
    });

    effect(() => {
      // If the id of the quiz has changed (should only happen when saving a new quiz), redirect
      // to the same page with the correct quiz id in the url
      const selectedQuizId = this.#quizStore.selectedQuizId();
      const urlQuizId = this.#quizId$();

      if (selectedQuizId !== urlQuizId) {
        this.#router.navigate([selectedQuizId], { relativeTo: this.#route.parent });
      }
    });
  }

  handleSaveQuiz() {
    this.#quizStore.saveQuiz(this.form.value);
  } 

  handleCreateQuestion() {
    if (this.form.dirty) {
      return;
    }

    this.#router.navigate(['question', 'create'], { relativeTo: this.#route });
  }
}
