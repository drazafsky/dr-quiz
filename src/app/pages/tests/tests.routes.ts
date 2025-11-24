import { Routes } from '@angular/router';
import { TestListPage } from './test-list-page';

import { TestDetailPage } from './details/test-detail-page';

export const routes: Routes = [
  { path: '', component: TestListPage },
  { path: ':testId', component: TestDetailPage },
];
