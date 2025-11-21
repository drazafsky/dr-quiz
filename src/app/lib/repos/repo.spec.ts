import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Repo } from './repo';

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
  });

  describe('getItem', () => {
    it('should retrieve an item from localStorage', () => {
      const key = 'TESTS';
      const value = { id: 1, name: 'Test Item' };
      localStorage.setItem(key, JSON.stringify(value));

      const result = service.getItem(key);
      expect(result).toEqual(value);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from localStorage', () => {
      const key = 'TESTS';
      localStorage.setItem(key, JSON.stringify({ id: 1, name: 'Test Item' }));

      service.removeItem(key);

      expect(localStorage.getItem(key)).toBeNull();
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
  });
});
