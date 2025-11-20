import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TestRepo } from '../../lib/test-repo';

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

    save(test: any) {
      const savedTest = testRepo.save(test);
      patchState(state, { selectedTest: savedTest });
      this.getAll();
    },
  }))
);
