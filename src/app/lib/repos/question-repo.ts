import { Injectable } from "@angular/core";
import { Repo } from "./repo";
import { Question } from "../types/question";

@Injectable({ providedIn: 'root' })
export class QuestionRepo extends Repo<Question[]> {
  override readonly STORAGE_KEY: string = 'QUESTIONS';
}
