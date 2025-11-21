import { TestBed } from '@angular/core/testing';

import { QuizDetailsPageService } from './quiz-details-page-service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { QuizStore } from '../../../lib/stores/quiz.store';

describe('QuizDetailsPageService', () => {
  let service: QuizDetailsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        QuizStore,
      ]
    });
    service = TestBed.inject(QuizDetailsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
