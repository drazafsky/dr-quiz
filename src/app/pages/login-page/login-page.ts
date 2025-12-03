import { Component, inject } from '@angular/core';
import { UserStore } from '../../lib/stores/user.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { notEmptyValidator } from '../../lib/validators/not-empty.validator';
import { CardComponent } from "../../lib/components/card/card";
import { ToolbarComponent } from "../../lib/components/toolbar/toolbar.component";

@Component({
  selector: 'app-login-page',
  imports: [CardComponent, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  readonly #userStore = inject(UserStore);
  readonly #fb = inject(FormBuilder);

  form = this.#fb.group({
    username: ['', [Validators.required, notEmptyValidator()]]
  });

  handleLoginSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;
    this.#userStore.login(formValue?.username || undefined);
  }
}
