import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { CardComponent } from "../../../lib/components/card/card.component";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notEmptyValidator } from '../../../lib/validators/not-empty.validator';
import { ToolbarComponent } from "../../../lib/components/toolbar/toolbar.component";

@Component({
  selector: 'app-quiz-detail-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, CardComponent, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './quiz-detail-page.html',
  providers: [QuizStore],
})
export class QuizDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);
  readonly #fb = inject(FormBuilder);

  #quizId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('quizId'))
  ));

  form: FormGroup = this.#fb.group({
    title: ['', [Validators.required, notEmptyValidator()]],
    description: [''],
    timeLimit: [60, [Validators.min(1)]],
    shuffleQuestions: [false, Validators.required],
  });

  quiz$ = computed(() => {
    const quizId = this.#quizId$();

    if (quizId?.toLowerCase() === 'create') {
      return this.#quizStore.newQuiz();
    }

    return this.#quizStore.quizzes().find(quiz => quiz.id === quizId);
  });

  constructor() {
    effect(() => {
      const quiz = this.quiz$();

      if (quiz !== undefined) {
        this.form.patchValue(quiz);
      }
    })
  }

  handleSaveQuiz() {
    console.log('Saving');
  }

  handlePublishQuiz() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
  }
}
