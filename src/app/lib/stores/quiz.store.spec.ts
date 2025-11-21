import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizStore } from './quiz.store';
import { QuizRepo } from '../repos/quiz-repo';
import { Quiz } from '../types/quiz';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Quiz #1',
    description: 'A description',
    timeLimit: 1000,
    shuffleQuestions: false,
    questions: [],
    isPublished: false
  },
  {
    id: '2',
    title: 'Quiz #2',
    description: '',
    timeLimit: 60,
    shuffleQuestions: true,
    questions: [ 'ABC', '123' ],
    isPublished: true
  },
];

describe('QuizStore', () => {
  const mockQuizRepo = {
    getItem: vi.fn((): Quiz[] | null => MOCK_QUIZZES),
    setItem: vi.fn((quizzes: Quiz[]) => {}),
    removeItem: vi.fn(() => {}),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        QuizStore,
        { provide: QuizRepo, useValue: mockQuizRepo }
      ],
    });
  });

  it('should initialize with empty quizzes if no data in repo', () => {
    vi.spyOn(mockQuizRepo, 'getItem').mockReturnValue(null);
    const store = TestBed.inject(QuizStore);

    expect(store.quizzes()).toEqual([]);
  });

  it('should initialize with quizzes from repo', () => {
    vi.spyOn(mockQuizRepo, 'getItem').mockReturnValue(MOCK_QUIZZES);
    const store = TestBed.inject(QuizStore);

    expect(store.quizzes()).toEqual(MOCK_QUIZZES);
  });

  it('should update selectedQuizId when selectQuiz is called', () => {
    const store = TestBed.inject(QuizStore);
    store.selectQuiz('1');

    expect(store.selectedQuizId()).toBe('1');
  });

  it('should compute quizCount correctly', () => {
    const store = TestBed.inject(QuizStore);
    expect(store.quizCount()).toBe(2);
  });
});
