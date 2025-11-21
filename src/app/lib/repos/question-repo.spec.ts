import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { QuestionRepo } from './question-repo';
import { Question } from '../types/question';
import { provideZonelessChangeDetection } from '@angular/core';

describe('QuestionRepo', () => {
  let service: QuestionRepo;
  const STORAGE_KEY = 'QUESTIONS';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(QuestionRepo);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a question in localStorage', () => {
      const questions: Question[] = [
        {
          id: '1',
          required: true,
          pointValue: 10,
          prompt: 'Sample Question',
          answers: ['Answer1', 'Answer2'],
          correctAnswer: 'Answer1',
        },
      ];
      service.setItem(questions);

      const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(storedValue).toEqual(questions);
    });

    it('should handle errors when storing a question', () => {
      const question: Question = {
        id: '1',
        required: true,
        pointValue: 10,
        prompt: 'Sample Question',
        answers: ['Answer1', 'Answer2'],
        correctAnswer: 'Answer1',
      };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(question)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve a question from localStorage', () => {
      const question: Question = {
        id: '1',
        required: true,
        pointValue: 10,
        prompt: 'Sample Question',
        answers: ['Answer1', 'Answer2'],
        correctAnswer: 'Answer1',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(question));

      const result = service.getItem();
      expect(result).toEqual(question);
    });

    it('should return null if the question does not exist', () => {
      const result = service.getItem();
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving a question', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem();
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove a question from localStorage', () => {
      const question: Question = {
        id: '1',
        required: true,
        pointValue: 10,
        prompt: 'Sample Question',
        answers: ['Answer1', 'Answer2'],
        correctAnswer: 'Answer1',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(question));

      service.removeItem();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle errors when removing a question', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem()).not.toThrow();
    });
  });
});
