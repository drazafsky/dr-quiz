import { Answer } from "./answer";

export interface Question {
    id?: string;
    required: boolean;
    pointValue: number;
    prompt: string;
    answers: Answer[];
}