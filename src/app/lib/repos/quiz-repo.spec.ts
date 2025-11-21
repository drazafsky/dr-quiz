import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { QuizRepo } from './quiz-repo';
import { Quiz } from '../types/quiz';
import { provideZonelessChangeDetection } from '@angular/core';

describe('QuizRepo', () => {
  let service: QuizRepo;
  const STORAGE_KEY = 'QUIZZES';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(QuizRepo);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a quiz in localStorage', () => {
      const quizzes: Quiz[] = [
        {
          id: '1',
          title: 'Sample Quiz',
          description: 'A sample quiz',
          timeLimit: 60,
          shuffleQuestions: false,
          questions: [],
          isPublished: false,
        },
      ];
      service.setItem(quizzes);

      const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(storedValue).toEqual(quizzes);
    });

    it('should handle errors when storing a quiz', () => {
      const quiz: Quiz = {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(quiz)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve a quiz from localStorage', () => {
      const quiz: Quiz = {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));

      const result = service.getItem();
      expect(result).toEqual(quiz);
    });

    it('should return null if the quiz does not exist', () => {
      const result = service.getItem();
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving a quiz', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem();
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove a quiz from localStorage', () => {
      const quiz: Quiz = {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quiz));

      service.removeItem();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle errors when removing a quiz', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem()).not.toThrow();
    });
  });
});
