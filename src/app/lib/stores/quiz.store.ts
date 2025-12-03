import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Quiz } from '../types/quiz';
import { QuizRepo } from '../repos/quiz-repo';
import { v4 as uuidv4 } from 'uuid';
import { setLoading, stopLoading, withLoadingFeature } from './loading-feature';
import { clearSaveStatus, setSuccess, withSaveStatusFeature } from './save-status-feature';
import { UserRepo } from '../repos/user-repo';
import { UserStore } from './user.store';

type QuizState = {
    allQuizzes: Quiz[];
    selectedQuizId: string | undefined;
    loading: boolean;
    save: {
        success: boolean | undefined;
        error: boolean | undefined;
    }
}

const initialState: QuizState = {
    allQuizzes: [],
    selectedQuizId: undefined,
    loading: false,
    save: {
        success: undefined,
        error: undefined
    }
}

export const QuizStore = signalStore(
    withState(initialState),
    withMethods((state, quizRepo = inject(QuizRepo), userStore = inject(UserStore)) => {
        return {
            selectQuiz(selectedQuizId: string | undefined) {
                const quiz = state.allQuizzes().find(q => q.id === selectedQuizId);
                const userId = userStore.loggedInUser()?.id;

                if (quiz?.userId === userId) {
                    patchState(state, { selectedQuizId });
                } else {
                    patchState(state, { selectedQuizId: undefined });
                }
            },

            saveQuiz(newQuiz: Quiz, ) {
                patchState(state, setLoading());
                patchState(state, clearSaveStatus());

                let selectedQuizId = state.selectedQuizId();

                if (
                    selectedQuizId === 'create'
                    || !selectedQuizId
                    || selectedQuizId === ''
                ) {
                    selectedQuizId = uuidv4();

                    const userId = userStore.loggedInUser()?.id;
                    if (userId !== undefined) {
                        newQuiz.userId = userId;
                    }
                }

                newQuiz.id = newQuiz.id ? newQuiz.id : selectedQuizId;

                const allQuizzes = state.allQuizzes();
                const replaceIndex = allQuizzes.findIndex(eq => eq.id === newQuiz.id);

                if (replaceIndex > -1) {
                    const mergedQuizValues = {
                        ...allQuizzes[replaceIndex],
                        ...newQuiz
                    };
                    allQuizzes.splice(replaceIndex, 1, mergedQuizValues);
                } else {
                    allQuizzes.push(newQuiz);
                }

                patchState(state, { allQuizzes, selectedQuizId: newQuiz.id });
                quizRepo.setItem(allQuizzes);

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
            },

            newQuiz() {
                const quiz: Quiz = {
                    userId: '',
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
                const quizIndex = state.allQuizzes().findIndex(eq => eq.id === quiz.id);

                if (quizIndex > -1) {
                    const allQuizzes = [...state.allQuizzes()];
                    allQuizzes.splice(quizIndex, 1);
                    patchState(state, { allQuizzes });
                    quizRepo.setItem(state.allQuizzes());
                }

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
            },

            publish(quiz: Quiz) {
                patchState(state, setLoading());
                const quizIndex = state.allQuizzes().findIndex(eq => eq.id === quiz.id);

                if (quizIndex > -1) {
                    const allQuizzes = [...state.allQuizzes()];
                    const updatedQuiz = {
                        ...allQuizzes[quizIndex],
                        isPublished: true,
                    };
                    allQuizzes.splice(quizIndex, 1, updatedQuiz);
                    patchState(state, { allQuizzes });
                    quizRepo.setItem(state.allQuizzes());
                }

                // Simulate time taken by an API so that visual feedback can be given to the user
                setTimeout(() => {
                    patchState(state, stopLoading());
                    patchState(state, setSuccess());
                }, 1000);
            },
        }
    }),
    withComputed((state, userStore = inject(UserStore)) => ({
        publishedQuizzes: computed(() => state.allQuizzes().filter(quiz => quiz.isPublished)),
        quizCount: computed(() => state.allQuizzes().length),
        selectedQuiz: computed(() => {
            const selectedQuizId = state.selectedQuizId();
            if (!selectedQuizId || selectedQuizId?.toLowerCase() === 'create') {
                return state.newQuiz();
            }

            return state.allQuizzes().find(q => q.id === selectedQuizId);
        }),
        quizzes: computed(() => {
            const user = userStore.loggedInUser();
            if (user === undefined) {
                return [];
            }

            return state.allQuizzes().filter(quiz => quiz.userId === user.id);
        }),
    })),
    withHooks((state) => {
        const quizRepo = inject(QuizRepo);
        return {
            onInit() {
                patchState(state, setLoading());
                const allQuizzes = quizRepo.getItem();
                if (allQuizzes !== null) {
                    patchState(state, { allQuizzes });
                } else {
                    patchState(state, { allQuizzes: [] });
                }
                patchState(state, stopLoading());
            },

            onDestroy() {
                patchState(state, setLoading());
                const allQuizzes = quizRepo.getItem();
                if (allQuizzes !== null) {
                    quizRepo.setItem(allQuizzes);
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