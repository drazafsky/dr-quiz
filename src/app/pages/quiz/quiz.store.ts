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
                isPublished: false,
                shuffleQuestions: false,
                questions: [],
            } as Quiz;
        },

        publish(quiz: Quiz) {
            patchState(state, { isLoading: true });
            quiz.isPublished = true;
            const savedQuiz = this.save(quiz);
            this.getAll();
            patchState(state, { isLoading: false });
            return savedQuiz;
        },

        save(quiz: Quiz) {
            patchState(state, { isLoading: false });
            if (!quiz.id) {
                // New quiz so add an id
                quiz.id = uuidv4();
            }

            const savedQuiz = quizRepo.save(quiz);
            this.getAll();
            patchState(state, { isLoading: false });
            return savedQuiz;
        },
    }))
)