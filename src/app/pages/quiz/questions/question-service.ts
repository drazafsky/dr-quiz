import { v4 as uuidv4 } from 'uuid';
import { Question } from '../../../lib/types/question';

export class QuestionService {
    convertToQuestionDTO(question: Question): Question {
        const id = !!question.id && question.id !== 'create' ? question.id : uuidv4();
        const correctAnswer = !!question.correctAnswer ? question.correctAnswer : '';

        const dto: Question = {
            ...question,
            id,
            correctAnswer,
        };

        return dto;
    }
}