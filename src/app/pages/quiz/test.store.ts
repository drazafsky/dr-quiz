import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TestRepo } from '../../lib/test-repo';
import { Test } from './types/test';
import { QuizRepo } from '../../lib/quiz-repo';

type TestState = {
  tests: any[];
  selectedTest: Test | undefined;
};

const initialState: TestState = {
  tests: [],
  selectedTest: undefined,
};

export const TestStore = signalStore(
  withState(initialState),
  withMethods((state, testRepo = inject(TestRepo), quizRepo = inject(QuizRepo)) => ({
    getAll() {
      const tests = testRepo.getAll();
      patchState(state, { tests });
    },

    getById(id: string) {
      const selectedTest = testRepo.getById(id);
      patchState(state, { selectedTest });
    },

    save(test: Test) {
      test.isSubmitted = false;
      const savedTest = testRepo.save(test);
      patchState(state, { selectedTest: savedTest });
      this.getAll();
    },

    submit(test: Test) {
      test.isSubmitted = true;
      test.score = this.score(test);
      const submittedTest = testRepo.save(test);
      patchState(state, { selectedTest: submittedTest });
      this.getAll();
    },

    score(test: Test) {
      let score = 0;
      const quiz = quizRepo.getById(test.id);

      if (quiz) {
        score = quiz?.questions.map(quizQuestion => {
          const testAnswer = test.questions.find(testQuestion => testQuestion.id === quizQuestion.id);

          if (testAnswer && quizQuestion.answers.findIndex(quizQuestionAnswer => testAnswer.answer === quizQuestionAnswer.id && quizQuestionAnswer.isCorrect) > -1) {
            return quizQuestion.pointValue;
          }

          return 0;
        })
        .reduce((acc, score) => acc + score);
      }

      return score;
    }
  }))
);
