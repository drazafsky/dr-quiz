import { TestBed } from '@angular/core/testing';

import { QuizRepo } from './quiz-repo';

describe('QuizRepo', () => {
  let service: QuizRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
