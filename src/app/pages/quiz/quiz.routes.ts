import { Routes } from '@angular/router';
import { QuizListPage } from './quiz-list-page/quiz-list-page';
import { QuizDetailsPage } from './quiz-details-page/quiz-details-page';

export const routes: Routes = [
  { path: '', component: QuizListPage },
  { path: ':quizId', component: QuizDetailsPage },
];
