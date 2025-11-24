import { computed, inject } from '@angular/core';
import { QuestionRepo } from '../repos/question-repo';
import { Question } from '../types/question';
import { signalStore, withHooks, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { setLoading, stopLoading } from './loading-feature';
import { v4 as uuidv4 } from 'uuid';
import { setSuccess } from './save-status-feature';

type QuestionState = {
  quizId: string;
  questions: Question[];
  selectedQuestionId: string | undefined;
  loading: boolean;
  save: {
    success: boolean | undefined;
    error: boolean | undefined;
  };
};

const initialState: QuestionState = {
  quizId: '',
  questions: [],
  selectedQuestionId: undefined,
  loading: false,
  save: {
    success: undefined,
    error: undefined,
  },
};

export const QuestionStore = signalStore(
  withState(initialState),
  withMethods((state, questionRepo = inject(QuestionRepo)) => {
    return {
      setQuizId(quizId: string | undefined) {
        patchState(state, { quizId });
      },

      selectQuestion(selectedQuestionId: string | undefined) {
        patchState(state, { selectedQuestionId });
      },

      saveQuestion(newQuestion: Question) {
        patchState(state, setLoading());
        patchState(state, { save: { success: undefined, error: undefined } });

        const questionIndex = state.questions().findIndex(question => question.id === newQuestion.id);
        if (questionIndex === -1) {
          // New question
          patchState(state, {
            questions: [...state.questions(), newQuestion],
            selectedQuestionId: newQuestion.id,
          });
        } else {
          // Updated question
          const updatedQuestions = state.questions().map((question) =>
            question.id === newQuestion.id ? { ...newQuestion, id: question.id } : question
          );
          patchState(state, { questions: updatedQuestions });
        }

        try {
          questionRepo.setItem(state.questions());
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

      newQuestion() {
          const question: Question = {
            id: '',
            required: false,
            pointValue: 1,
            prompt: '',
            correctAnswer: '',
            quizId: ''
          };

          return question;
      },

      deleteQuestion(question: Question) {
        patchState(state, setLoading());
        const questionIndex = state.questions().findIndex(eq => eq.id === question.id);

        if (questionIndex > -1) {
          const questions = [...state.questions()];
          questions.splice(questionIndex, 1);
          patchState(state, { questions });
          questionRepo.setItem(state.questions());
        }

        // Simulate time taken by an API so that visual feedback can be given to the user
        setTimeout(() => {
            patchState(state, stopLoading());
            patchState(state, setSuccess());
        }, 1000);
      }
    };
  }),
  withComputed((state) => ({
    selectedQuestion: computed(() => {
        const selectedQuestionId = state.selectedQuestionId();
        if (!selectedQuestionId || selectedQuestionId?.toLowerCase() === 'create') {
            return state.newQuestion();
        }

        return state.questions().find(q => q.id === selectedQuestionId);
    }),

    quizQuestions: computed(() => {
      const selectedQuizId = state.quizId();
      const questions = state.questions();
      return questions.filter(question => question.quizId === selectedQuizId);
    }),
  })),
  withHooks((state) => {
    const questionRepo = inject(QuestionRepo);
    return {
      onInit() {
        patchState(state, setLoading());
        const questions = questionRepo.getItem();
        if (questions !== null) {
          patchState(state, { questions });
        } else {
          patchState(state, { questions: [] });
        }
        patchState(state, stopLoading());
      },
      onDestroy() {
        patchState(state, setLoading());
        const questions = questionRepo.getItem();
        if (questions !== null) {
          questionRepo.setItem(questions);
        } else {
          questionRepo.removeItem();
        }
        patchState(state, stopLoading());
      },
    };
  })
);
