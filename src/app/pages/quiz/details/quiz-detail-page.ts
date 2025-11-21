import { Component, computed, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';
import { CardComponent } from "../../../lib/components/card/card.component";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quiz-detail-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, CardComponent, ReactiveFormsModule],
  templateUrl: './quiz-detail-page.html',
  providers: [QuizStore],
})
export class QuizDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  #quizId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('quizId'))
  ));


  form: FormGroup;

  constructor() {
    const fb = inject(FormBuilder);
    const quiz = this.quiz$();

    this.form = fb.group({
      title: [quiz?.title || ''],
      description: [quiz?.description || ''],
      timeLimit: [quiz?.timeLimit || 0],
      shuffleQuestions: [quiz?.shuffleQuestions || false],
      questions: [quiz?.questions || []],
      isPublished: [quiz?.isPublished || false],
    });
  }

  quiz$ = computed(() => {
    const quizId = this.#quizId$();

    if (quizId?.toLowerCase() === 'create') {
      return this.#quizStore.newQuiz();
    }

    return this.#quizStore.quizzes().find(quiz => quiz.id === quizId);
  });
}
