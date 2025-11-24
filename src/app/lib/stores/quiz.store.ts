import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Quiz } from '../types/quiz';
import { QuizRepo } from '../repos/quiz-repo';
import { v4 as uuidv4 } from 'uuid';
import { setLoading, stopLoading, withLoadingFeature } from './loading-feature';
import { clearSaveStatus, setSuccess, withSaveStatusFeature } from './save-status-feature';

type QuizState = {
    quizzes: Quiz[];
    selectedQuizId: string | undefined;
    loading: boolean;
    save: {
        success: boolean | undefined;
        error: boolean | undefined;
    }
}

const initialState: QuizState = {
    quizzes: [],
    selectedQuizId: undefined,
    loading: false,
    save: {
        success: undefined,
        error: undefined
    }
}

export const QuizStore = signalStore(
    withState(initialState),
    withMethods((state, quizRepo = inject(QuizRepo)) => {
        return {
            selectQuiz(selectedQuizId: string | undefined) {
                patchState(state, { selectedQuizId });
            },

            saveQuiz(newQuiz: Quiz) {
                patchState(state, setLoading());
                patchState(state, clearSaveStatus());

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

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
            },

            newQuiz() {
                const quiz: Quiz = {
                    title: '',
                    description: '',
                    timeLimit: 60,
                    shuffleQuestions: false,
                    isPublished: false
                };

                return quiz;
            },

            deleteQuiz(quiz: Quiz) {
                patchState(state, setLoading());
                const quizIndex = state.quizzes().findIndex(eq => eq.id === quiz.id);

                if (quizIndex > -1) {
                    const quizzes = [...state.quizzes()];
                    quizzes.splice(quizIndex, 1);
                    patchState(state, { quizzes });
                    quizRepo.setItem(state.quizzes());
                }

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
            },

            publish(quiz: Quiz) {
                patchState(state, setLoading());
                const quizIndex = state.quizzes().findIndex(eq => eq.id === quiz.id);

                if (quizIndex > -1) {
                    const quizzes = [...state.quizzes()];
                    const updatedQuiz = {
                        ...quizzes[quizIndex],
                        isPublished: true,
                    };
                    quizzes.splice(quizIndex, 1, updatedQuiz);
                    patchState(state, { quizzes });
                    quizRepo.setItem(state.quizzes());
                }

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
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
                patchState(state, setLoading());
                const quizzes = quizRepo.getItem();
                if (quizzes !== null) {
                    patchState(state, { quizzes });
                } else {
                    patchState(state, { quizzes: [] });
                }
                patchState(state, stopLoading());
            },

            onDestroy() {
                patchState(state, setLoading());
                const quizzes = quizRepo.getItem();
                if (quizzes !== null) {
                    quizRepo.setItem(quizzes);
                } else {
                    quizRepo.removeItem();
                }
                patchState(state, stopLoading());
            }
        }
    }),
    withLoadingFeature(),
    withSaveStatusFeature(),
)