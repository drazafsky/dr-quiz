import { Routes } from '@angular/router';
import { IntroPage } from './pages/intro-page/intro-page';

export const routes: Routes = [
  { path: '', component: IntroPage },
  //{ path: 'quiz', loadChildren: () => import('./pages/quiz/quiz.routes').then(m => m.routes) },
];
