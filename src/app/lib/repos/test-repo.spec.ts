import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TestRepo } from './test-repo';
import { Test } from '../types/test';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TestRepo', () => {
  let service: TestRepo;
  const STORAGE_KEY = 'TESTS';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(TestRepo);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store a test in localStorage', () => {
      const test: Test = {
        id: '1',
        isSubmitted: false,
        score: {
          correct: 0,
          incorrect: 1,
          points: 0,
          percent: 0
        },
        questions: [],
        quizId: '',
        timeTaken: 0
      };
      service.setItem(test);

      const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(storedValue).toEqual(test);
    });

    it('should handle errors when storing a test', () => {
      const test: Test = {
        id: '1',
        isSubmitted: false,
        score: {
          correct: 0,
          incorrect: 1,
          points: 0,
          percent: 0
        },
        questions: [],
        quizId: '',
        timeTaken: 0
      };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(test)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve a test from localStorage', () => {
      const test: Test = {
        id: '1',
        isSubmitted: false,
        score: {
          correct: 0,
          incorrect: 1,
          points: 0,
          percent: 0
        },
        questions: [],
        quizId: '',
        timeTaken: 0
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(test));

      const result = service.getItem();
      expect(result).toEqual(test);
    });

    it('should return null if the test does not exist', () => {
      const result = service.getItem();
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving a test', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem();
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove a test from localStorage', () => {
      const test: Test = {
        id: '1',
        isSubmitted: false,
        score: {
          correct: 0,
          incorrect: 1,
          points: 0,
          percent: 0
        },
        questions: [],
        quizId: '',
        timeTaken: 0
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(test));

      service.removeItem();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle errors when removing a test', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem()).not.toThrow();
    });
  });
});
