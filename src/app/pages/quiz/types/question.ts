import { Answer } from "./answer";

export interface Question {
    required: boolean;
    pointValue: number;
    prompt: string;
    answers: Answer[];
}