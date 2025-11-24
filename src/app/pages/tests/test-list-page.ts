import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../lib/components/card/card';
import { ToolbarComponent } from '../../lib/components/toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TestStore } from '../../lib/stores/test.store';
import { Test } from '../../lib/types/test';

@Component({
  selector: 'app-test-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ToolbarComponent],
  templateUrl: './test-list-page.html',
  providers: [TestStore],
})
export class TestListPage {
  readonly #testStore = inject(TestStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  tests$ = this.#testStore.tests;

  handleNew() {
    this.#router.navigate(['create'], { relativeTo: this.#route });
  }

  handleEdit(test: Test) {
    this.#router.navigate([test.id], { relativeTo: this.#route });
  }

  handleDelete(test: Test) {
    this.#testStore.deleteTest(test);
  }

  handlePublish(test: Test) {
    this.#testStore.publish(test);
  }
}
