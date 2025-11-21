import { Question } from "./question";

export interface Quiz {
    id?: string;
    title: string;
    description: string;
    timeLimit: number; // Number of seconds allowed for taking the quiz
    shuffleQuestions: boolean;
    questions: string[]; // Ids of questions to include in the quiz
    isPublished: boolean;
}