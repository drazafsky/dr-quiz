import { computed, inject } from '@angular/core';
import { TestRepo } from '../repos/test-repo';
import { Test } from '../types/test';
import { signalStore, withHooks, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { setLoading, stopLoading } from './loading-feature';
import { QuestionStore } from './question.store';
import { AnswerStore } from './answer.store';
import { setSuccess } from './save-status-feature';

type TestState = {
  tests: Test[];
  selectedTestId: string | undefined;
  loading: boolean;
  save: {
    success: boolean | undefined;
    error: boolean | undefined;
  };
};

const initialState: TestState = {
  tests: [],
  selectedTestId: undefined,
  loading: false,
  save: {
    success: undefined,
    error: undefined,
  },
};

export const TestStore = signalStore(
  withState(initialState),
  withMethods((state, testRepo = inject(TestRepo), questionStore = inject(QuestionStore)) => {
    return {
      selectTest(selectedTestId: string | undefined) {
        patchState(state, { selectedTestId });
      },

      saveTest(newTest: Test) {
        patchState(state, setLoading());
        patchState(state, { save: { success: undefined, error: undefined } });

        const testIndex = state.tests().findIndex(test => test.id === newTest.id);
        if (testIndex === -1) {
          // New test
          patchState(state, {
            tests: [...state.tests(), newTest],
            selectedTestId: newTest.id,
          });
        } else {
          // Updated test 
          const isSubmitted = newTest.questions.length === newTest.selectedAnswers.length;

          // Calculate the score if the test has been submitted
          if (isSubmitted) {
            let correct = 0;
            let incorrect = 0;
            let points = 0;
            const totalPoints = newTest.questions.reduce((sum, questionId) => {
              const question = questionStore.questions().find(q => q.id === questionId);
              return sum + (question?.pointValue || 0);
            }, 0);

            newTest.selectedAnswers.forEach((answerId, index) => {
              const questionId = newTest.questions[index];
              const question = questionStore.questions().find(q => q.id === questionId);
              if (question?.correctAnswer === answerId) {
                correct++;
                points += question.pointValue;
              } else {
                incorrect++;
              }
            });

            const percent = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;
            newTest = {
              ...newTest,
              score: {
                correct,
                incorrect,
                points,
                percent,
              },
            };
          }

          newTest = {
            ...newTest,
            isSubmitted, 
          };

        const updatedTests = state.tests().map((test) =>
            test.id === newTest.id ? { ...newTest, id: test.id } : test
          );
          patchState(state, { tests: updatedTests });
        }

        try {
          testRepo.setItem(state.tests());
          patchState(state, { save: { success: true, error: undefined } });
        } catch (e) {
          patchState(state, { save: { success: undefined, error: true } });
        } finally {
          patchState(state, stopLoading());

          // Simulate time taken by an API so that visual feedback can be given to the user
          setTimeout(() => {
              patchState(state, stopLoading());
              patchState(state, setSuccess());
          }, 1000);
        }
      },

      newTest() {
          const test: Test = {
            id: '',
            quizId: '',
            questions: [],
            selectedAnswers: [],
            isSubmitted: false,
            deadLine: new Date((new Date()).getSeconds() + 60),
            score: {
              correct: 0,
              incorrect: 0,
              points: 0,
              percent: 0
            },
          };

          return test;
      },

      deleteTest(test: Test) {
        patchState(state, setLoading());
        const testIndex = state.tests().findIndex(eq => eq.id === test.id);

        if (testIndex > -1) {
          const tests = [...state.tests()];
          tests.splice(testIndex, 1);
          patchState(state, { tests });
          testRepo.setItem(state.tests());
        }

        // Simulate time taken by an API so that visual feedback can be given to the user
        setTimeout(() => {
            patchState(state, stopLoading());
            patchState(state, setSuccess());
        }, 1000);
      },
    };
  }),
  withComputed((state) => ({
    selectedTest: computed(() => {
        const selectedTestId = state.selectedTestId();
        if (!selectedTestId || selectedTestId?.toLowerCase() === 'create') {
            return state.newTest();
        }

        return state.tests().find(t => t.id === selectedTestId);
    }),
  })),
  withComputed((state, questionStore = inject(QuestionStore)) => ({
    nextUnasweredQuestion: computed(() => {
      const test = state.selectedTest();
      const answeredQuestions = test?.selectedAnswers || [];

      questionStore.setQuizId(test?.quizId);
      const questions = questionStore
        .quizQuestions()
        .sort((q1, q2) => (test?.questions.indexOf(q1.id) || 0) - (test?.questions.indexOf(q2.id) || 0));

      return questions[answeredQuestions.length];
    }),

    previousQuestion: computed(() => {
      const test = state.selectedTest();
      const answeredQuestions = test?.selectedAnswers || [];

      questionStore.setQuizId(test?.quizId);
      const questions = questionStore
        .quizQuestions()
        .sort((q1, q2) => (test?.questions.indexOf(q1.id) || 0) - (test?.questions.indexOf(q2.id) || 0));

      const questionIndex = answeredQuestions.length > 0 ? answeredQuestions.length - 1 : 0;
      return questions[questionIndex];
    }),
  })),
  withComputed((state, answerStore = inject(AnswerStore)) => ({
    nextUnansweredQuestionsAnswers: computed(() => {
      const question = state.nextUnasweredQuestion();
      if (question) {
        return answerStore.getQuestionAnswers(question.id);
      }

      return undefined;
    }), 

    previousQuestionAnswers: computed(() => {
      const question = state.previousQuestion();
      return answerStore.getQuestionAnswers(question.id);
    }),

    previousQuestionSubmittedAnswer: computed(() => {
      return state.selectedTest()?.selectedAnswers[-1];
    }),
  })),
  withHooks((state, testRepo = inject(TestRepo)) => {
    return {
      onInit() {
        patchState(state, setLoading());
        const tests = testRepo.getItem();
        if (tests !== null) {
          // Mark all tests past the deadline as submitted
          const now = new Date();

          tests
            .filter(test => !test.isSubmitted)
            .forEach(test => {
              const deadLine = new Date(test.deadLine);

              if (deadLine < now) {
                test.isSubmitted = true;
              }
            });

          testRepo.setItem(tests);

          patchState(state, { tests });
        } else {
          patchState(state, { tests: [] });
        }
        patchState(state, stopLoading());
      },

      onDestroy() {
        patchState(state, setLoading());
        const tests = testRepo.getItem();
        if (tests !== null) {
          testRepo.setItem(tests);
        } else {
          testRepo.removeItem();
        }
        patchState(state, stopLoading());
      },
    };
  })
);
