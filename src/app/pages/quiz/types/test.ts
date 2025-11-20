import { Question } from "./question";

export interface Test {
    id?: string;
    title: string;
    description: string;
    timeLimit: number; // Number of seconds allowed for taking the test
    shuffleQuestions: boolean;
    questions: Question[];
    isSubmitted: boolean;
    timeTaken: number; // Number of seconds the user has been working on the test
}
