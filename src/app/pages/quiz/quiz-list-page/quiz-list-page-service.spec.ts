import { TestBed } from '@angular/core/testing';

import { QuizListPageService } from './quiz-list-page-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { QuizStore } from '../quiz.store';
import { TestStore } from '../test.store';

describe('QuizListPageService', () => {
  let service: QuizListPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        QuizStore,
        TestStore,
      ]
    });
    service = TestBed.inject(QuizListPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
