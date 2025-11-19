import { Component, inject } from '@angular/core';
import { QuizDetailsPageService } from './quiz-details-page-service';
import { combineLatest, filter, map } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { QuizStore } from '../quiz.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz-details-page',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './quiz-details-page.html',
  styleUrl: './quiz-details-page.scss',
  providers: [QuizStore, QuizDetailsPageService],
})
export class QuizDetailsPage {
  readonly #quizDetailsService = inject(QuizDetailsPageService); 

  #quiz$ = this.#quizDetailsService.quizId$
  .pipe(
    takeUntilDestroyed(),
    filter(quizId => quizId !== null),
    map(quizId => {
      if (quizId !== 'create') {
        return this.#quizDetailsService.getById(parseInt(quizId));
      }
      
      return this.#quizDetailsService.getNew();
    })
  );

  vm$ = combineLatest([
    this.#quiz$,
    this.#quizDetailsService.isLoading$,
  ]).pipe(
    map(([ quiz, isLoading ]) => ({
      quiz,
      isLoading
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
