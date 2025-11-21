export interface Test {
    id: string;
    quizId: string;
    questions: string[]; // List of the questions to display to the user in the order to display them
    isSubmitted: boolean;
    timeTaken: number; // Number of seconds the user has been working on the test
    score: {
        correct: number;
        incorrect: number;
        points: number;
        percent: number;
    }
}
