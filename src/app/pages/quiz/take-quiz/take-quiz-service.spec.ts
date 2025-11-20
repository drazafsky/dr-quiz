import { TestBed } from '@angular/core/testing';

import { TakeQuizService } from './take-quiz-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { QuizStore } from '../quiz.store';
import { TestStore } from '../test.store';

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
