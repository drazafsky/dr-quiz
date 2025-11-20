import { Answer } from "./answer";

export interface Question {
    pointValue: number;
    prompt: string;
    answers: Answer[];
}