import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { CardComponent } from '../../../lib/components/card/card';
import { ToolbarComponent } from '../../../lib/components/toolbar/toolbar.component';
import { TestStore } from '../../../lib/stores/test.store';
import { notEmptyValidator } from '../../../lib/validators/not-empty.validator';

@Component({
  selector: 'app-test-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ToolbarComponent
  ],
  templateUrl: './test-detail-page.html',
  providers: [TestStore],
})
export class TestDetailPage {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #testStore = inject(TestStore);
  readonly #fb = inject(FormBuilder);

  readonly #testId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('testId')),
    filter(testId => testId !== null)
  ));

  readonly #testId$ = toSignal(this.#route.paramMap.pipe(
    takeUntilDestroyed(),
    map(params => params.get('testId')),
    filter(testId => testId !== null)
  ));

  readonly test$ = this.#testStore.selectedTest;

  constructor() {
    const test = this.#testStore.tests().find((t) => t.id === this.#testId$());

    if (test) {
      this.form.patchValue(test);
    }

    effect(() => {
      const selectedTestId = this.#testId$();
      this.#testStore.selectTest(selectedTestId);
    });
  }
  readonly processing$ = this.#testStore.loading;
  readonly saveStatus$ = this.#testStore.save;

  form: FormGroup = this.#fb.group({
    isSubmitted: [false],
  });

  constructor() {
    const test = this.#testStore.tests().find((t) => t.id === this.#testId$());

    if (test) {
      this.form.patchValue(test);
    }

    effect(() => {
      const selectedTestId = this.#testId$();
      this.#testStore.selectTest(selectedTestId);
    });

    effect(() => {
      // Redirect to the same page with the updated testId parameter whenever it changes
      const selectedTestId = this.#testStore.selectedTestId();
      const urlTestId = this.#testId$();

      if (selectedTestId !== urlTestId) {
        this.#router.navigate(['../', selectedTestId], { relativeTo: this.#route });
      }
    });
  }

  handleSaveTest() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const updatedTest = {
      ...this.form.value,
      id: this.#testId$(),
    };

    this.#testStore.saveTest(updatedTest);
  }
}
