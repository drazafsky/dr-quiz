import { inject, Injectable } from '@angular/core';
import { Repo, StorageKeys } from './repos/repo';
import { Test } from './types/test';

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

  save(test: Test) {
    const tests = this.getAll();

    const updatedTests = [
      ...tests.filter(existingTest => existingTest.id !== test.id),
      test,
    ];

    this.#repo.setItem<any[]>(StorageKeys.TESTS, updatedTests);

    return test;
  }
}
