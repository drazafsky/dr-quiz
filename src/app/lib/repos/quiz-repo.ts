import { Injectable } from "@angular/core";
import { Repo } from "./repo";

@Injectable({ providedIn: 'root' })
export class QuizRepo extends Repo {
  readonly #STORAGE_KEY: string = 'QUIZZES';

  override setItem<T>(value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(this.#STORAGE_KEY, jsonValue);
    } catch (e) {}
  }

  override getItem<T>(): T | null {
    try {
      const jsonValue = localStorage.getItem(this.#STORAGE_KEY);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
    } catch (e) {
      return null;
    }
  }

  override removeItem(): void {
    try {
      localStorage.removeItem(this.#STORAGE_KEY);
    } catch (e) {}
  }
}
