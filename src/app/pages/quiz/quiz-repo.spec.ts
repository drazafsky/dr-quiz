import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { QuizRepo } from './quiz-repo';
import { provideZonelessChangeDetection } from '@angular/core';
import { Repo } from '../../lib/repo';
import { Quiz } from './types/quiz';

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
        provideZonelessChangeDetection(),
        {
          provide: Repo, useValue: mockRepo
        }
      ]
    });
    service = TestBed.inject(QuizRepo);
  });

  describe('getAll', () => {
    it('should return an empty array if no quizzes are stored', () => {
      mockRepo.getItem = vi.fn().mockReturnValue(null);

      const result = service.getAll();

      expect(result).toEqual([]);
    });

    it('should return all stored quizzes', () => {
      const mockQuizzes: Quiz[] = [{
        id: '1', title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }, {
        id: '2', title: 'Quiz 2',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }];
      mockRepo.getItem = vi.fn().mockReturnValue(mockQuizzes);

      const result = service.getAll();

      expect(result).toEqual(mockQuizzes);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
