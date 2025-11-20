import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizStore } from '../quiz.store';
import { TestStore } from '../test.store';
import { Test } from '../types/test';

@Injectable({
  providedIn: 'root',
})
export class TakeQuizService {
  readonly #route = inject(ActivatedRoute);
  readonly #quizStore = inject(QuizStore);

  readonly #testStore = inject(TestStore);

  readonly quiz$ = computed(() => {
    const quiz = this.#quizStore.selectedQuiz()

    if (quiz?.shuffleQuestions) {
      quiz.questions.sort(() => Math.random() - 0.5);
    }

    return quiz;
  });
  readonly test$ = computed(() => {
    const test = this.#testStore.selectedTest()
    const quiz = this.quiz$();

    if (test && quiz?.shuffleQuestions) {
      // Order the test questions according to the quiz question order
        const questionOrder = quiz.questions.map(q => q.id);
        test.questions.sort((a, b) => questionOrder.indexOf(a.id) - questionOrder.indexOf(b.id));
    }

    return test;
  });

  constructor() {
    this.#route.paramMap.subscribe(params => {
      const quizId = params.get('quizId');
      if (quizId) {
        this.#quizStore.getById(quizId);
        this.#testStore.getById(quizId);
      }
    });
  }

  save(test: Test) {
    this.#testStore.save(test);
  }

  submit(test: Test) {
    this.#testStore.submit(test);
  }

  isAnswerCorrect(questionId: string, answerId: string): boolean {
    const question = this.quiz$()?.questions.find(question => question.id === questionId);

    if (question) {
      return question.answers
        .filter(answer => answer.id === answerId && answer.isCorrect)
        ?.length > 0;
    }

    return false;
  }
}
