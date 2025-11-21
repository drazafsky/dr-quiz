import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Quiz } from '../types/quiz';
import { QuizRepo } from '../repos/quiz-repo';
import { v4 as uuidv4 } from 'uuid';

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
    withMethods((state, quizRepo = inject(QuizRepo)) => {
        return {
            selectQuiz(selectedQuizId: string | undefined) {
                patchState(state, { selectedQuizId });
            },

            saveQuiz(newQuiz: Quiz) {
                let selectedQuizId = state.selectedQuizId();

                if (
                    selectedQuizId === 'create'
                    || !selectedQuizId
                    || selectedQuizId === ''
                ) {
                    selectedQuizId = uuidv4();
                }

                newQuiz.id = newQuiz.id ? newQuiz.id : selectedQuizId;

                const quizzes = state.quizzes();
                const replaceIndex = quizzes.findIndex(eq => eq.id === newQuiz.id);

                if (replaceIndex > -1) {
                    const mergedQuizValues = {
                        ...quizzes[replaceIndex],
                        ...newQuiz
                    };
                    quizzes.splice(replaceIndex, 1, mergedQuizValues);
                } else {
                    quizzes.push(newQuiz);
                }

                patchState(state, { quizzes, selectedQuizId: newQuiz.id });
                quizRepo.setItem(quizzes);
            },

            newQuiz() {
                const quiz: Quiz = {
                    title: '',
                    description: '',
                    timeLimit: 60,
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
        selectedQuiz: computed(() => {
            const selectedQuizId = state.selectedQuizId();
            if (!selectedQuizId || selectedQuizId?.toLowerCase() === 'create') {
                return state.newQuiz();
            }

            return state.quizzes().find(q => q.id === selectedQuizId);
        }),
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