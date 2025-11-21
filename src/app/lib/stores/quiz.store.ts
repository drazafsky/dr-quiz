import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Quiz } from '../types/quiz';
import { QuizRepo } from '../repos/quiz-repo';

type QuizState = {
    quizzes: Quiz[];
    selectedQuizId: string | undefined;
}

const initialState: QuizState = {
    quizzes: [],
    selectedQuizId: undefined,
}

export const QuizStore = signalStore(
    withState(initialState),
    withMethods((state) => {
        return {
            selectQuiz(selectedQuizId: string) {
                patchState(state, { selectedQuizId });
            },
        }
    }),
    withComputed((state) => ({
        quizCount: computed(() => state.quizzes().length),
    })),
    withHooks((state) => {
        const quizRepo = inject(QuizRepo);
        return {
            onInit() {
                const quizzes = quizRepo.getItem();
                if (quizzes !== null) {
                    patchState(state, { quizzes });
                } else {
                    patchState(state, { quizzes: [] });
                }
            },

            onDestroy() {
                const quizzes = quizRepo.getItem();
                if (quizzes !== null) {
                    quizRepo.setItem(quizzes);
                } else {
                    quizRepo.removeItem();
                }
            }
        }
    })
)