import { TestBed } from '@angular/core/testing';

import { QuizListPageService } from './quiz-list-page-service';

describe('QuizListPageService', () => {
  let service: QuizListPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizListPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
