import { Injectable } from "@angular/core";
import { Repo } from "./repo";
import { Answer } from "../types/answer";

@Injectable({ providedIn: 'root' })
export class AnswerRepo extends Repo<Answer[]> {
  override readonly STORAGE_KEY: string = 'ANSWERS';
}
