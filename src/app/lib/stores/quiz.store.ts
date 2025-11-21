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

            saveQuiz(newQuiz: Quiz) {
                const quizzes = state.quizzes();
                const quizToReplace = quizzes.findIndex(eq => eq.id === newQuiz.id);

                if (quizToReplace > -1) {
                    quizzes.splice(quizToReplace, 1, newQuiz);
                } else {
                    quizzes.push(newQuiz);
                }

                patchState(state, { quizzes });
            },

            newQuiz() {
                const quiz: Quiz = {
                    id: '',
                    title: '',
                    description: '',
                    timeLimit: 0,
                    shuffleQuestions: false,
                    questions: [],
                    isPublished: false
                };

                return quiz;
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