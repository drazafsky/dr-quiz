import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class Repo {
  readonly #STORAGE_KEY: string = 'REPO-KEY';

  setItem<T>(value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(this.#STORAGE_KEY, jsonValue);
    } catch (e) {}
  }

  getItem<T>(): T | null {
    try {
      const jsonValue = localStorage.getItem(this.#STORAGE_KEY);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
    } catch (e) {
      return null;
    }
  }

  removeItem(): void {
    try {
      localStorage.removeItem(this.#STORAGE_KEY);
    } catch (e) {}
  }
}