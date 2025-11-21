import { TestStore } from './test.store';
import { TestRepo } from '../test-repo';
import { QuizRepo } from '../quiz-repo';
import { Test } from '../../pages/quiz/types/test';
import { Quiz } from '../../pages/quiz/types/quiz';
import { vi } from 'vitest';

describe('TestStore', () => {
  let testStore: any;
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

    testStore = TestStore.create(undefined, mockTestRepo, mockQuizRepo);
  });

  describe('getAll', () => {
    it('should load all tests into state', () => {
      const mockTests: Test[] = [{ id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 }];
      vi.spyOn(mockTestRepo, 'getAll').mockReturnValue(mockTests);

      testStore.getAll();

      expect(testStore.state().tests).toEqual(mockTests);
    });
  });

  describe('getById', () => {
    it('should load the selected test into state', () => {
      const mockTest: Test = { id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 };
      vi.spyOn(mockTestRepo, 'getById').mockReturnValue(mockTest);

      testStore.getById('1');

      expect(testStore.state().selectedTest).toEqual(mockTest);
    });
  });

  describe('save', () => {
    it('should save a test and update state', () => {
      const mockTest: Test = { id: '1', questions: [], isSubmitted: false, timeTaken: 0, score: 0 };
      vi.spyOn(mockTestRepo, 'save').mockReturnValue(mockTest);

      testStore.save(mockTest);

      expect(testStore.state().selectedTest).toEqual(mockTest);
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

      expect(testStore.state().selectedTest?.isSubmitted).toBe(true);
      expect(testStore.state().selectedTest?.score).toBe(0);
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
