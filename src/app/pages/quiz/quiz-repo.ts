import { inject, Injectable } from '@angular/core';
import { Repo, StorageKeys } from '../../lib/repo';
import { Quiz } from './types/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizRepo {
  readonly #repo = inject(Repo);

  getAll() {
    const quizzes = this.#repo.getItem<Quiz[]>(StorageKeys.QUIZZES);

    return quizzes === null ? [] : quizzes;
  }

  getById(id: string) {
    const allQuizzes = this.getAll();
    return allQuizzes.find(quiz => quiz.id === id);
  }

  save(quiz: Quiz) {
    const quizzes = this.getAll();

    const updatedQuizzes = [
      ...quizzes.filter(exisitingQuiz => exisitingQuiz.id !== quiz.id),
      quiz
    ];

    this.#repo.setItem<Quiz[]>(StorageKeys.QUIZZES, updatedQuizzes);

    return quiz;
  }
}
