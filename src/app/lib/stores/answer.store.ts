import { computed, inject } from '@angular/core';
import { AnswerRepo } from '../repos/answer-repo';
import { Answer } from '../types/answer';
import { signalStore, withHooks, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { setLoading, stopLoading } from './loading-feature';
import { v4 as uuidv4 } from 'uuid';
import { setSuccess } from './save-status-feature';

type AnswerState = {
  questionId: string;
  answers: Answer[];
  selectedAnswerId: string | undefined;
  loading: boolean;
  save: {
    success: boolean | undefined;
    error: boolean | undefined;
  };
};

const initialState: AnswerState = {
  questionId: '',
  answers: [],
  selectedAnswerId: undefined,
  loading: false,
  save: {
    success: undefined,
    error: undefined,
  },
};

export const AnswerStore = signalStore(
  withState(initialState),
  withMethods((state, answerRepo = inject(AnswerRepo)) => {
    return {
      setQuestionId(questionId: string | undefined) {
        patchState(state, { questionId });
      },

      selectAnswer(selectedAnswerId: string | undefined) {
        patchState(state, { selectedAnswerId });
      },

      saveAnswer(newAnswer: Answer) {
        patchState(state, setLoading());
        patchState(state, { save: { success: undefined, error: undefined } });

        const answerIndex = state.answers().findIndex(answer => answer.id === newAnswer.id);
        if (answerIndex === -1) {
          // New answer
          patchState(state, {
            answers: [...state.answers(), newAnswer],
            selectedAnswerId: newAnswer.id,
          });
        } else {
          // Updated answer
          const updatedAnswers = state.answers().map((answer) =>
            answer.id === newAnswer.id ? { ...newAnswer, id: answer.id } : answer
          );
          patchState(state, { answers: updatedAnswers });
        }

        try {
          answerRepo.setItem(state.answers());
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

      newAnswer() {
          const answer: Answer = {
            id: '',
            text: '',
            questionId: ''
          };

          return answer;
      },

      deleteAnswer(answer: Answer) {
        patchState(state, setLoading());
        const answerIndex = state.answers().findIndex(eq => eq.id === answer.id);

        if (answerIndex > -1) {
          const answers = [...state.answers()];
          answers.splice(answerIndex, 1);
          patchState(state, { answers });
          answerRepo.setItem(state.answers());
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
    selectedAnswer: computed(() => {
        const selectedAnswerId = state.selectedAnswerId();
        if (!selectedAnswerId || selectedAnswerId?.toLowerCase() === 'create') {
            return state.newAnswer();
        }

        return state.answers().find(a => a.id === selectedAnswerId);
    }),

    questionAnswers: computed(() => {
      const selectedQuestionId = state.questionId();
      const answers = state.answers();
      return answers.filter(answer => answer.questionId === selectedQuestionId);
    }),
  })),
  withHooks((state) => {
    const answerRepo = inject(AnswerRepo);
    return {
      onInit() {
        patchState(state, setLoading());
        const answers = answerRepo.getItem();
        if (answers !== null) {
          patchState(state, { answers });
        } else {
          patchState(state, { answers: [] });
        }
        patchState(state, stopLoading());
      },
      onDestroy() {
        patchState(state, setLoading());
        const answers = answerRepo.getItem();
        if (answers !== null) {
          answerRepo.setItem(answers);
        } else {
          answerRepo.removeItem();
        }
        patchState(state, stopLoading());
      },
    };
  })
);
