import { TestBed } from '@angular/core/testing';

import { Repo } from './repo';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Repo', () => {
  let service: Repo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(Repo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('setItem', () => {
    it('should store an item in localStorage', () => {
      const key = 'TESTS';
      const value = { id: 1, name: 'Test Item' };
      service.setItem(key, value);

      const storedValue = JSON.parse(localStorage.getItem(key) || '{}');
      expect(storedValue).toEqual(value);
    });

    it('should handle errors gracefully when storing an item', () => {
      const key = 'TESTS';
      const value = { id: 1, name: 'Test Item' };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(key, value)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve an item from localStorage', () => {
      const key = 'TESTS';
      const value = { id: 1, name: 'Test Item' };
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.getItem(key);
      expect(result).toEqual(value);
    });

    it('should return null if the item does not exist', () => {
      const result = service.getItem('NON_EXISTENT_KEY');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully when retrieving an item', () => {
      const key = 'TESTS';
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem(key);
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from localStorage', () => {
      const key = 'TESTS';
      localStorage.setItem(key, JSON.stringify({ id: 1, name: 'Test Item' }));

      service.removeItem(key);

      expect(localStorage.getItem(key)).toBeNull();
    });

    it('should handle errors gracefully when removing an item', () => {
      const key = 'TESTS';
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem(key)).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('TESTS', JSON.stringify({ id: 1, name: 'Test Item' }));
      localStorage.setItem('QUIZZES', JSON.stringify({ id: 2, name: 'Quiz Item' }));

      service.clear();

      expect(localStorage.getItem('TESTS')).toBeNull();
      expect(localStorage.getItem('QUIZZES')).toBeNull();
    });

    it('should handle errors gracefully when clearing localStorage', () => {
      vi.spyOn(localStorage, 'clear').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.clear()).not.toThrow();
    });
  });
});
