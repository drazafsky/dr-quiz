import { v4 as uuidv4 } from 'uuid';
import { Quiz } from '../../lib/types/quiz';
import { Test } from '../../lib/types/test';
import { Question } from '../../lib/types/question';

export interface QuizWithRelatedQuestions extends Quiz {
  questions: Question[];
}

export class TestService {
    convertToTestDTO(test: Test, testQuiz: QuizWithRelatedQuestions): Test {
        const id = !!test.id && test.id !== '' ? test.id : uuidv4();
        const now = new Date();
        const deadLine = new Date(now.setSeconds(now.getSeconds() + testQuiz.timeLimit));

        const questions = testQuiz.questions.map(question => question.id);
        if (testQuiz.shuffleQuestions) {
            questions.sort(() => Math.random() - 0.5)
        }

        const dto: Test = {
            ...test,
            id,
            deadLine,
            questions: [...questions]
        };

        return dto;
    }
}