export interface Test {
    id: string;
    quizId: string;
    questions: string[]; // List of the questions to display to the user in the order to display them
    isSubmitted: boolean;
    deadLine: Date; // When the test must be finished
    score: {
        correct: number;
        incorrect: number;
        points: number;
        percent: number;
    }
}
