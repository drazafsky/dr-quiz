import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { TestRepo } from './test-repo';
import { provideZonelessChangeDetection } from '@angular/core';
import { Repo } from './repo';

describe('TestRepo', () => {
  let service: TestRepo;
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
    service = TestBed.inject(TestRepo);
  });

  describe('getAll', () => {
    it('should return an empty array if no tests are stored', () => {
      mockRepo.getItem = vi.fn().mockReturnValue(null);

      const result = service.getAll();

      expect(result).toEqual([]);
    });

    it('should return all stored tests', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
      mockRepo.getItem = vi.fn().mockReturnValue(mockTests);

      const result = service.getAll();

      expect(result).toEqual(mockTests);
    });
  });

  describe('getById', () => {
    it('should return the test with the specified ID', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
      vi.spyOn(service, 'getAll').mockReturnValue(mockTests);

      const result = service.getById('1');

      expect(result).toEqual(mockTests[0]);
    });

    it('should return undefined if no test matches the specified ID', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }];
      vi.spyOn(service, 'getAll').mockReturnValue(mockTests);

      const result = service.getById('3');

      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should add a new test if it does not already exist', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }];
      const newTest = { id: '2', name: 'Test 2' };
      vi.spyOn(service, 'getAll').mockReturnValue(mockTests);

      service.save(newTest);

      expect(mockRepo.setItem).toHaveBeenCalledWith('TESTS', [...mockTests, newTest]);
    });

    it('should update an existing test if it already exists', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }];
      const updatedTest = { id: '1', name: 'Updated Test 1' };
      vi.spyOn(service, 'getAll').mockReturnValue(mockTests);

      service.save(updatedTest);

      expect(mockRepo.setItem).toHaveBeenCalledWith('TESTS', [updatedTest]);
    });
  });

  describe('deleteById', () => {
    it('should remove the test with the specified ID', () => {
      const mockTests = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }];
      vi.spyOn(service, 'getAll').mockReturnValue(mockTests);

      service.deleteById('1');

      expect(mockRepo.setItem).toHaveBeenCalledWith('TESTS', [{ id: '2', name: 'Test 2' }]);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
