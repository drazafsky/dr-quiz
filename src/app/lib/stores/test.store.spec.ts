import { TestStore } from './test.store';
import { TestRepo } from '../test-repo';
import { QuizRepo } from '../quiz-repo';
import { Test } from '../types/test';
import { Quiz } from '../types/quiz';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, Signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { QuizStore } from './quiz.store';
import { StateSource } from '@ngrx/signals';

describe('TestStore', () => {
  let testStore: {
    tests: Signal<any[]>;
    selectedTest: Signal<Test | undefined>;
    getAll: () => void;
    getById: (id: string) => void;
    save: (test: Test) => void;
    submit: (test: Test) => void;
    score: (test: Test) => number;
  } & StateSource<{
      tests: any[];
      selectedTest: Test | undefined;
  }>;

  let mockTestRepo: TestRepo;
  let mockQuizRepo: QuizRepo;

  beforeEach(() => {
    mockTestRepo = {
      getAll: vi.fn(),
      getById: vi.fn(),
      save: vi.fn(),
    } as unknown as TestRepo;

    mockQuizRepo = {
      getById: vi.fn(),
    } as unknown as QuizRepo;

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: QuizRepo, useValue: mockQuizRepo },
        { provide: TestRepo, useValue: mockTestRepo },
        TestStore,
        QuizStore
      ]
    });

    testStore = TestBed.inject(TestStore);
  });

  describe('getAll', () => {
    it('should load all tests into state', () => {
      const mockTests: Test[] = [{ id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 }];
      vi.spyOn(mockTestRepo, 'getAll').mockReturnValue(mockTests);

      testStore.getAll();

      expect(testStore.tests()).toEqual(mockTests);
    });
  });

  describe('getById', () => {
    it('should load the selected test into state', () => {
      const mockTest: Test = { id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 };
      vi.spyOn(mockTestRepo, 'getById').mockReturnValue(mockTest);

      testStore.getById('1');

      expect(testStore.selectedTest()).toEqual(mockTest);
    });
  });

  describe('save', () => {
    it('should save a test and update state', () => {
      const mockTest: Test = { id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 };
      vi.spyOn(mockTestRepo, 'save').mockReturnValue(mockTest);

      testStore.save(mockTest);

      expect(testStore.selectedTest()).toEqual(mockTest);
      expect(mockTestRepo.save).toHaveBeenCalledWith(mockTest);
    });
  });

  describe('submit', () => {
    it('should submit a test, calculate score, and update state', () => {
      const mockTest: Test = { id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 };
      const mockQuiz: Quiz = {
        id: '1',
        title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      };
      vi.spyOn(mockQuizRepo, 'getById').mockReturnValue(mockQuiz);
      vi.spyOn(mockTestRepo, 'save').mockReturnValue({ ...mockTest, isSubmitted: true, score: 0 });

      testStore.submit(mockTest);

      expect(testStore.selectedTest()?.isSubmitted).toBe(true);
      expect(testStore.selectedTest()?.score).toBe(0);
      expect(mockTestRepo.save).toHaveBeenCalledWith({ ...mockTest, isSubmitted: true, score: 0 });
    });
  });

  describe('score', () => {
    it('should calculate the score of a test based on correct answers', () => {
      const mockTest: Test = {
        id: '1',
        questions: [{ id: 'q1', answer: 'a1' }],
        isSubmitted: false,
        timeTaken: 0,
        score: 0,
      };
      const mockQuiz: Quiz = {
        id: '1',
        title: 'Quiz 1',
        description: '',
        timeLimit: 0,
        shuffleQuestions: false,
        questions: [
          {
            id: 'q1',
            required: true,
            pointValue: 10,
            prompt: 'Question 1',
            answers: [{ id: 'a1', value: 'Answer 1', isCorrect: true }],
          },
        ],
        isPublished: false,
      };
      vi.spyOn(mockQuizRepo, 'getById').mockReturnValue(mockQuiz);

      const score = testStore.score(mockTest);

      expect(score).toBe(10);
    });
  });
});
