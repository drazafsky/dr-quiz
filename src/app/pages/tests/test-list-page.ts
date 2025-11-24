import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../lib/components/card/card';
import { ToolbarComponent } from '../../lib/components/toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TestStore } from '../../lib/stores/test.store';
import { QuizStore } from '../../lib/stores/quiz.store';
import { computed } from '@angular/core';
import { Test } from '../../lib/types/test';
import { Quiz } from '../../lib/types/quiz';

interface TestWithRelatedQuiz extends Test {
  quiz: Quiz;
}

@Component({
  selector: 'app-test-list-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ToolbarComponent],
  templateUrl: './test-list-page.html',
  providers: [QuizStore, TestStore],
})
export class TestListPage {
  readonly #testStore = inject(TestStore);
  readonly #quizStore = inject(QuizStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  quizzes$ = this.#quizStore.quizzes;
  tests$ = computed(() => {
    const tests = this.#testStore.tests();
    const quizzes = this.quizzes$();

    return tests.map(test => ({
      ...test,
      quiz: quizzes.find(quiz => quiz.id === test.quizId),
    }));
  });

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
