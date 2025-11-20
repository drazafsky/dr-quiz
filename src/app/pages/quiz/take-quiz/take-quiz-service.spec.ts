import { TestBed } from '@angular/core/testing';

import { TakeQuizService } from './take-quiz-service';

describe('TakeQuizService', () => {
  let service: TakeQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TakeQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
