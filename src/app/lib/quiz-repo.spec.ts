import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { QuizRepo } from './quiz-repo';
import { provideZonelessChangeDetection } from '@angular/core';
import { Repo } from './repo';
import { Quiz } from '../pages/quiz/types/quiz';

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

  describe('deleteById', () => {
    it('should remove the quiz with the specified ID', () => {
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
      vi.spyOn(service, 'getAll').mockReturnValue(mockQuizzes);

      service.deleteById('1');

      expect(mockRepo.setItem).toHaveBeenCalledWith('QUIZZES', [mockQuizzes[1]]);
    });

    it('should do nothing if the quiz ID does not exist', () => {
      const mockQuizzes: Quiz[] = [{
        id: '1', title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }];
      vi.spyOn(service, 'getAll').mockReturnValue(mockQuizzes);

      service.deleteById('3');

      expect(mockRepo.setItem).toHaveBeenCalledWith('QUIZZES', mockQuizzes);
    });
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

  describe('getById', () => {
    it('should return the quiz with the specified ID', () => {
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
      vi.spyOn(service, 'getAll').mockReturnValue(mockQuizzes);

      const result = service.getById('1');

      expect(result).toEqual(mockQuizzes[0]);
    });

    it('should return undefined if no quiz matches the specified ID', () => {
      const mockQuizzes: Quiz[] = [{
        id: '1', title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }];
      vi.spyOn(service, 'getAll').mockReturnValue(mockQuizzes);

      const result = service.getById('3');

      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should add a new quiz if it does not already exist', () => {
      const mockQuizzes: Quiz[] = [{
        id: '1', title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }];

      const newQuiz: Quiz = {
        id: '2', title: 'Quiz 2',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      };

      vi.spyOn(service, 'getAll').mockReturnValue([...mockQuizzes, newQuiz]);

      service.save(newQuiz);

      expect(mockRepo.setItem).toHaveBeenCalledWith('QUIZZES', [...mockQuizzes, newQuiz]);
    });

    it('should update an existing quiz if it already exists', () => {
      const mockQuizzes: Quiz[] = [{
        id: '1', title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      }];
      const updatedQuiz: Quiz = {
        id: '1', title: 'Updated Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false
      };
      vi.spyOn(service, 'getAll').mockReturnValue(mockQuizzes);

      service.save(updatedQuiz);

      expect(mockRepo.setItem).toHaveBeenCalledWith('QUIZZES', [updatedQuiz]);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
