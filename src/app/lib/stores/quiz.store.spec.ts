import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QuizStore } from './quiz.store';
import { QuizRepo } from '../repos/quiz-repo';
import { Quiz } from '../types/quiz';

vi.mock('../repos/quiz-repo', () => ({
  QuizRepo: vi.fn().mockImplementation(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  })),
}));

describe('QuizStore', () => {
  let store: ReturnType<typeof QuizStore>;
  let quizRepo: QuizRepo;

  beforeEach(() => {
    quizRepo = new QuizRepo();
    store = QuizStore();
  });

  it('should initialize with empty quizzes if no data in repo', () => {
    vi.spyOn(quizRepo, 'getItem').mockReturnValue(null);

    store.onInit();

    expect(store.state.quizzes()).toEqual([]);
  });

  it('should initialize with quizzes from repo', () => {
    const quizzes: Quiz[] = [
      {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      },
    ];
    vi.spyOn(quizRepo, 'getItem').mockReturnValue(quizzes);

    store.onInit();

    expect(store.state.quizzes()).toEqual(quizzes);
  });

  it('should save quizzes to repo on destroy', () => {
    const quizzes: Quiz[] = [
      {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      },
    ];
    store.state.quizzes.set(quizzes);

    store.onDestroy();

    expect(quizRepo.setItem).toHaveBeenCalledWith(quizzes);
  });

  it('should remove quizzes from repo on destroy if empty', () => {
    store.state.quizzes.set([]);

    store.onDestroy();

    expect(quizRepo.removeItem).toHaveBeenCalled();
  });

  it('should update selectedQuizId when selectQuiz is called', () => {
    store.selectQuiz('1');

    expect(store.state.selectedQuizId()).toBe('1');
  });

  it('should compute quizCount correctly', () => {
    const quizzes: Quiz[] = [
      {
        id: '1',
        title: 'Sample Quiz',
        description: 'A sample quiz',
        timeLimit: 60,
        shuffleQuestions: false,
        questions: [],
        isPublished: false,
      },
      {
        id: '2',
        title: 'Another Quiz',
        description: 'Another sample quiz',
        timeLimit: 120,
        shuffleQuestions: true,
        questions: [],
        isPublished: true,
      },
    ];
    store.state.quizzes.set(quizzes);

    expect(store.state.quizCount()).toBe(2);
  });
});
