import { computed, inject } from '@angular/core';
import { QuestionRepo } from '../repos/question-repo';
import { Question } from '../types/question';
import { signalStore, withHooks, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { setLoading, stopLoading } from './loading-feature';

type QuestionState = {
  questions: Question[];
  selectedQuestionId: string | undefined;
  filterIds: string[] | undefined;
  loading: boolean;
  save: {
    success: boolean | undefined;
    error: boolean | undefined;
  };
};

const initialState: QuestionState = {
  questions: [],
  selectedQuestionId: undefined,
  filterIds: undefined,
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
      selectQuestion(selectedQuestionId: string | undefined) {
        patchState(state, { selectedQuestionId });
      },

      filter(filterIds: string[] | undefined) {
        patchState(state, { filterIds });
      },

      saveQuestion(newQuestion: Question) {
        patchState(state, setLoading());
        patchState(state, { save: { success: undefined, error: undefined } });

        let selectedQuestionId = state.selectedQuestionId();

        if (
          selectedQuestionId === 'create' ||
          !selectedQuestionId ||
          selectedQuestionId === ''
        ) {
          selectedQuestionId = crypto.randomUUID();
          newQuestion.id = selectedQuestionId;
          patchState(state, {
            questions: [...state.questions(), newQuestion],
            selectedQuestionId,
          });
        } else {
          const updatedQuestions = state.questions().map((question) =>
            question.id === selectedQuestionId ? { ...newQuestion, id: question.id } : question
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
        }
      },
    };
  }),
  withComputed((state) => ({
    filteredQuestions: computed(() => state.questions().filter(question => state.filterIds()?.includes(question.id))),
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
