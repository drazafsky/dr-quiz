import { Routes } from "@angular/router";

import { QuizListPage } from './list/quiz-list-page';

import { QuizDetailPage } from './details/quiz-detail-page';

export const routes: Routes = [
  { path: '', component: QuizListPage },
  { path: ':quizId', component: QuizDetailPage },
];
