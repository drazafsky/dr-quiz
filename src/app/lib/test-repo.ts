import { inject, Injectable } from '@angular/core';
import { Repo, StorageKeys } from './repo';

@Injectable({
  providedIn: 'root',
})
export class TestRepo {
  readonly #repo = inject(Repo);

  getAll() {
    const tests = this.#repo.getItem<any[]>(StorageKeys.TESTS);
    return tests === null ? [] : tests;
  }

  getById(id: string) {
    const allTests = this.getAll();
    return allTests.find(test => test.id === id);
  }

  save(test: any) {
    const tests = this.getAll();

    const updatedTests = [
      ...tests.filter(existingTest => existingTest.id !== test.id),
      test,
    ];

    this.#repo.setItem<any[]>(StorageKeys.TESTS, updatedTests);

    return test;
  }

  deleteById(id: string) {
    const tests = this.getAll();
    const updatedTests = tests.filter(test => test.id !== id);
    this.#repo.setItem<any[]>(StorageKeys.TESTS, updatedTests);
  }
}
