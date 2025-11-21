import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuestionStore } from './question.store';
import { QuestionRepo } from '../repos/question-repo';
import { Question } from '../types/question';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    required: true,
    pointValue: 10,
    prompt: 'Sample Question 1',
    answers: ['Answer1', 'Answer2'],
    correctAnswer: 'Answer1',
  },
  {
    id: '2',
    required: false,
    pointValue: 5,
    prompt: 'Sample Question 2',
    answers: ['Answer3', 'Answer4'],
    correctAnswer: 'Answer3',
  },
];

describe('QuestionStore', () => {
  const mockQuestionRepo = {
    getItem: vi.fn((): Question[] | null => MOCK_QUESTIONS),
    setItem: vi.fn((questions: Question[]) => {}),
    removeItem: vi.fn(() => {}),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        QuestionStore,
        { provide: QuestionRepo, useValue: mockQuestionRepo },
      ],
    });
  });

  it('should initialize with empty questions if no data in repo', () => {
    vi.spyOn(mockQuestionRepo, 'getItem').mockReturnValue(null);
    const store = TestBed.inject(QuestionStore);

    expect(store.state.questions()).toEqual([]);
  });

  it('should initialize with questions from repo', () => {
    vi.spyOn(mockQuestionRepo, 'getItem').mockReturnValue(MOCK_QUESTIONS);
    const store = TestBed.inject(QuestionStore);

    expect(store.state.questions()).toEqual(MOCK_QUESTIONS);
  });

  it('should update selectedQuestionId when selectQuestion is called', () => {
    const store = TestBed.inject(QuestionStore);
    store.selectQuestion('1');

    expect(store.state.selectedQuestionId()).toBe('1');
  });

  it('should save a new question', () => {
    const store = TestBed.inject(QuestionStore);
    const newQuestion: Question = {
      id: '3',
      required: true,
      pointValue: 15,
      prompt: 'New Question',
      answers: ['Answer5', 'Answer6'],
      correctAnswer: 'Answer5',
    };

    store.saveQuestion(newQuestion);

    expect(store.state.questions()).toContainEqual(newQuestion);
    expect(mockQuestionRepo.setItem).toHaveBeenCalledWith(store.state.questions());
  });

  it('should update an existing question', () => {
    const store = TestBed.inject(QuestionStore);
    const updatedQuestion: Question = {
      id: '1',
      required: false,
      pointValue: 20,
      prompt: 'Updated Question',
      answers: ['Answer7', 'Answer8'],
      correctAnswer: 'Answer7',
    };

    store.saveQuestion(updatedQuestion);

    expect(store.state.questions()).toContainEqual(updatedQuestion);
    expect(mockQuestionRepo.setItem).toHaveBeenCalledWith(store.state.questions());
  });

  it('should handle errors when saving a question', () => {
    vi.spyOn(mockQuestionRepo, 'setItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const store = TestBed.inject(QuestionStore);
    const newQuestion: Question = {
      id: '3',
      required: true,
      pointValue: 15,
      prompt: 'New Question',
      answers: ['Answer5', 'Answer6'],
      correctAnswer: 'Answer5',
    };

    store.saveQuestion(newQuestion);

    expect(store.state.save.error()).toBe(true);
  });
});
