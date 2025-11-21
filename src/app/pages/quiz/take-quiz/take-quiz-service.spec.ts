import { TestBed } from '@angular/core/testing';

import { TakeQuizService } from './take-quiz-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestStore } from '../../../lib/stores/test.store';
import { QuizStore } from '../../../lib/stores/quiz.store';

describe('TakeQuizService', () => {
  let service: TakeQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        QuizStore,
        TestStore,
      ]
    });
    service = TestBed.inject(TakeQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
