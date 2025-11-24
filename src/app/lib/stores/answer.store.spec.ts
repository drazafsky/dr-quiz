import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnswerStore } from './answer.store';
import { AnswerRepo } from '../repos/answer-repo';
import { Answer } from '../types/answer';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

const MOCK_ANSWERS: Answer[] = [
  {
    id: '1',
    value: 'Sample Answer 1',
    questionId: ''
  },
  {
    id: '2',
    value: 'Sample Answer 2',
    questionId: ''
  },
];

describe('AnswerStore', () => {
  const mockAnswerRepo = {
    getItem: vi.fn((): Answer[] | null => MOCK_ANSWERS),
    setItem: vi.fn((_answers: Answer[]) => {}),
    removeItem: vi.fn(() => {}),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AnswerStore,
        { provide: AnswerRepo, useValue: mockAnswerRepo },
      ],
    });
  });

  it('should initialize with empty answers if no data in repo', () => {
    vi.spyOn(mockAnswerRepo, 'getItem').mockReturnValue(null);
    const store = TestBed.inject(AnswerStore);

    expect(store.answers()).toEqual([]);
  });

  it('should initialize with answers from repo', () => {
    vi.spyOn(mockAnswerRepo, 'getItem').mockReturnValue(MOCK_ANSWERS);
    const store = TestBed.inject(AnswerStore);

    expect(store.answers()).toEqual(MOCK_ANSWERS);
  });

  it('should update selectedAnswerId when selectAnswer is called', () => {
    const store = TestBed.inject(AnswerStore);
    store.selectAnswer('1');

    expect(store.selectedAnswerId()).toBe('1');
  });

  it('should save a new answer', () => {
    const store = TestBed.inject(AnswerStore);
    const newAnswer: Answer = {
      id: '3',
      value: 'New Answer',
      questionId: ''
    };

    store.saveAnswer(newAnswer);

    expect(store.answers()).toContainEqual(newAnswer);
    expect(mockAnswerRepo.setItem).toHaveBeenCalledWith(store.answers());
  });

  it('should update an existing answer', () => {
    const store = TestBed.inject(AnswerStore);
    const updatedAnswer: Answer = {
      id: '1',
      value: 'Updated Answer',
      questionId: ''
    };

    store.saveAnswer(updatedAnswer);

    expect(store.answers()).toContainEqual(updatedAnswer);
    expect(mockAnswerRepo.setItem).toHaveBeenCalledWith(store.answers());
  });
});
