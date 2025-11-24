import { Answer } from "./answer";

export interface Question {
    id: string;
    quizId: string;
    required: boolean;
    pointValue: number; // Must be a positive numeric value
    prompt: string;
    correctAnswer: string; // Id of the correct answer for the question. This value must be included in the answers array
}