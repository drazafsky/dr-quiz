import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TestRepo } from '../../lib/test-repo';
import { Test } from './types/test';

type TestState = {
  tests: any[];
  selectedTest: any | undefined;
};

const initialState: TestState = {
  tests: [],
  selectedTest: undefined,
};

export const TestStore = signalStore(
  withState(initialState),
  withMethods((state, testRepo = inject(TestRepo)) => ({
    getAll() {
      const tests = testRepo.getAll();
      patchState(state, { tests });
    },

    getById(id: string) {
      const selectedTest = testRepo.getById(id);
      patchState(state, { selectedTest });
    },

    save(test: Test) {
      test.isSubmitted = false;
      const savedTest = testRepo.save(test);
      patchState(state, { selectedTest: savedTest });
      this.getAll();
    },

    submit(test: Test) {
      test.isSubmitted = true;
      const submittedTest = testRepo.save(test);
      patchState(state, { selectedTest: submittedTest });
      this.getAll();
    },
  }))
);
