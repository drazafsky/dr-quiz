export interface Test {
    id: string;
    questions: Array<{
        id: string;
        answer: string
    }>;
    isSubmitted: boolean;
    timeTaken: number; // Number of seconds the user has been working on the test
    score: number;
}
