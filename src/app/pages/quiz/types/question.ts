import { Answer } from "./answer";

export interface Question {
    id: number;
    pointValue: number;
    prompt: string;
    answers: Answer[];
}