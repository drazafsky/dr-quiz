import { Answer } from "./answer";

export interface Question {
    id: string;
    required: boolean;
    pointValue: number; // Must be a positive numeric value
    prompt: string;
    answers: string[]; // Ids of answers to be shown for this question
    correctAnswer: string; // Id of the correct answer for the question. This value must be included in the answers array
}