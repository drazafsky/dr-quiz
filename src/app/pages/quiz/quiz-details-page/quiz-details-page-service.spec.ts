import { TestBed } from '@angular/core/testing';

import { QuizDetailsPageService } from './quiz-details-page-service';

describe('QuizDetailsPageService', () => {
  let service: QuizDetailsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizDetailsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
