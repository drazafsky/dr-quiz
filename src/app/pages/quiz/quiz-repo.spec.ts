import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { QuizRepo } from './quiz-repo';
import { provideZoneChangeDetection } from '@angular/core';
import { Repo } from '../../lib/repo';

describe('QuizRepo', () => {
  let service: QuizRepo;

  let mockRepo: Repo;

  beforeEach(() => {
    mockRepo = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    } as unknown as Repo;
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
