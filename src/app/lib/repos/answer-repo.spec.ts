import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AnswerRepo } from './answer-repo';
import { Answer } from '../types/answer';
import { provideZonelessChangeDetection } from '@angular/core';

describe('AnswerRepo', () => {
  let service: AnswerRepo;
  const STORAGE_KEY = 'ANSWERS';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(AnswerRepo);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store an answer in localStorage', () => {
      const answers: Answer[] = [
        {
          id: '1',
          value: 'Sample Answer',
        },
      ];
      service.setItem(answers);

      const storedValue = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(storedValue).toEqual(answers);
    });

    it('should handle errors when storing an answer', () => {
      const answer: Answer[] = [{
        id: '1',
        value: 'Sample Answer',
      }];
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(answer)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve an answer from localStorage', () => {
      const answer: Answer = {
        id: '1',
        value: 'Sample Answer',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answer));

      const result = service.getItem();
      expect(result).toEqual(answer);
    });

    it('should return null if the answer does not exist', () => {
      const result = service.getItem();
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving an answer', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem();
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove an answer from localStorage', () => {
      const answer: Answer = {
        id: '1',
        value: 'Sample Answer',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answer));

      service.removeItem();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should handle errors when removing an answer', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem()).not.toThrow();
    });
  });
});
