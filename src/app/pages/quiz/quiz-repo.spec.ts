import { TestBed } from '@angular/core/testing';

import { QuizRepo } from './quiz-repo';
import { provideZoneChangeDetection } from '@angular/core';
import { Repo } from '../../lib/repo';

describe('QuizRepo', () => {
  let service: QuizRepo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZoneChangeDetection(),
        {
          provide: Repo, useValue: mockRepo
        }
      ]
    });
    service = TestBed.inject(QuizRepo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
