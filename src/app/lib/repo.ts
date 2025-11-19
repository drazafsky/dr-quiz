import { Injectable } from "@angular/core";

const StorageKeys = {
  QUIZZES: 'QUIZZES', // Quizzes created by user
  TESTS: 'TESTS', // Quizzes taken by user
} as const;

export type StorageKeysType = (typeof StorageKeys)[keyof typeof StorageKeys];

@Injectable(
  { providedIn: 'root' }
)
class Repo {
  setItem<T>(key: StorageKeysType, value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (e) {}
  }

  getItem<T>(key: StorageKeysType): T | null {
    try {
      const jsonValue = localStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
    } catch (e) {
      return null;
    }
  }

  removeItem(key: StorageKeysType): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {}
  }
}

export { Repo, StorageKeys };