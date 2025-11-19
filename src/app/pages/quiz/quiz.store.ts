import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { QuizRepo } from './quiz-repo';
import { Quiz } from './types/quiz';

type QuizState = {
    quizzes: Quiz[];
    isLoading: boolean;
    isPublished: boolean;
}

const initialState: QuizState = {
    quizzes: [],
    isLoading: false,
    isPublished: false,
}

export const QuizStore = signalStore(
    withState(initialState),
    withMethods((state, quizRepo = inject(QuizRepo)) => ({
        loadAll() {
            patchState(state, { isLoading: true });
            const quizzes = quizRepo.getAll();
            patchState(state, { isLoading: false });
            return quizzes;
        },

        getById(id: number) {
            patchState(state, { isLoading: true });
            const quiz = quizRepo.getById(id);
            setTimeout(() => patchState(state, { isLoading: false }), 10000);
            return quiz;
        },

        getNew() {
            return {
                id: undefined,
                title: '',
                description: '',
                timeLimit: 60, // Default is one minute
                questions: [],
            } as Quiz;
        }
    }))
)