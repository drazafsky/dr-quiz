import { Injectable } from "@angular/core";
import { Repo } from "./repo";
import { Quiz } from "../types/quiz";

@Injectable({ providedIn: 'root' })
export class QuizRepo extends Repo<Quiz> {
  override readonly STORAGE_KEY: string = 'QUIZZES';
}
