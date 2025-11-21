import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Repo } from './repo';

describe('Repo', () => {
  let service: Repo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(Repo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should store an item in localStorage', () => {
      const value = { id: 1, name: 'Test Item' };
      service.setItem(value);

      const storedValue = JSON.parse(localStorage.getItem('TESTS') || '{}');
      expect(storedValue).toEqual(value);
    });

    it('should handle errors when storing an item', () => {
      const value = { id: 1, name: 'Test Item' };
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.setItem(value)).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve an item from localStorage', () => {
      const value = { id: 1, name: 'Test Item' };
      localStorage.setItem('TESTS', JSON.stringify(value));

      const result = service.getItem();
      expect(result).toEqual(value);
    });

    it('should return null if the item does not exist', () => {
      const result = service.getItem();
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving an item', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = service.getItem();
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove an item from localStorage', () => {
      localStorage.setItem('TESTS', JSON.stringify({ id: 1, name: 'Test Item' }));

      service.removeItem();

      expect(localStorage.getItem('TESTS')).toBeNull();
    });

    it('should handle errors when removing an item', () => {
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => service.removeItem()).not.toThrow();
    });
  });
});
