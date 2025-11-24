import { Question } from "./question";

export interface Quiz {
    id?: string;
    title: string;
    description: string;
    timeLimit: number; // Number of seconds allowed for taking the quiz
    shuffleQuestions: boolean;
    isPublished: boolean;
}