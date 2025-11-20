import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { QuizRepo } from './quiz-repo';
import { Quiz } from './types/quiz';
import { v4 as uuidv4 } from 'uuid';

type QuizState = {
    quizzes: Quiz[];
    selectedQuiz: Quiz | undefined;
    isPublished: boolean;
}

const initialState: QuizState = {
    quizzes: [],
    selectedQuiz: undefined,
    isPublished: false,
}

export const QuizStore = signalStore(
    withState(initialState),
    withMethods((state, quizRepo = inject(QuizRepo)) => ({
        getAll() {
            const quizzes = quizRepo.getAll();
            patchState(state, { quizzes });
        },

        getById(id: string) {
            const selectedQuiz = quizRepo.getById(id);
            patchState(state, { selectedQuiz });
        },

        getNew() {
            const selectedQuiz = {
                id: undefined,
                title: '',
                description: '',
                timeLimit: 60, // Default is one minute
                isPublished: false,
                shuffleQuestions: false,
                questions: [],
            } as Quiz;
            patchState(state, { selectedQuiz });
        },

        publish(quiz: Quiz) {
            if (quiz.isPublished) {
                return;
            }

            quiz.isPublished = true;
            const selectedQuiz = quizRepo.save(quiz);
            patchState(state, { selectedQuiz });
            this.getAll();
        },

        save(quiz: Quiz) {
            if (quiz.isPublished) {
                return;
            }

            if (!quiz.id) {
                // New quiz so add an id
                quiz.id = uuidv4();
            }

            const selectedQuiz = quizRepo.save(quiz);
            patchState(state, { selectedQuiz });
            this.getAll();
        },
    }))
)