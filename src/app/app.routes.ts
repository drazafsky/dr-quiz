import { Routes } from '@angular/router';
import { IntroPage } from './pages/intro-page/intro-page';
import { LoginPage } from './pages/login-page/login-page';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'intro', component: IntroPage },
  { path: 'quizzes', loadChildren: () => import('./pages/quiz/quiz.routes').then(m => m.routes) },
  { path: 'tests', loadChildren: () => import('./pages/tests/tests.routes').then(m => m.routes) },
];
