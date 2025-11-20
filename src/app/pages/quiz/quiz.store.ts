import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { QuizRepo } from './quiz-repo';
import { Quiz } from './types/quiz';
import { v4 as uuidv4 } from 'uuid';

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
        getAll() {
            patchState(state, { isLoading: true });
            const quizzes = quizRepo.getAll();
            patchState(state, { isLoading: false });
            return quizzes;
        },

        getById(id: string) {
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
                shuffleQuestions: false,
                questions: [],
            } as Quiz;
        },

        save(quiz: Quiz) {
            if (!quiz.id) {
                // New quiz so add an id
                quiz.id = uuidv4();
            }

            return quizRepo.save(quiz);
        },
    }))
)