import { Question } from "./question";

export interface Quiz {
    id?: number;
    title: string;
    description: string;
    timeLimit: number; // Number of seconds allowed for taking the quiz
    shuffleQuestions: boolean;
    questions: Question[];
}