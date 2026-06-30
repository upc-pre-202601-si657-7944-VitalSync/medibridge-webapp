import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { IamFacade } from '../../../application';
import { iamAuthSharedStyles } from '../../iam-auth-shared.styles';
import { TranslatePipe } from '../../../../../i18n/translate.pipe';
import { LanguageToggleComponent } from '../../../../../shared/language-toggle/language-toggle.component';
import type { SignInRequest } from '../../../domain';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, LanguageToggleComponent],
  templateUrl: './login-page.component.html',
  styles: [
    iamAuthSharedStyles,
    `
      /* ── Login-specific ── */
      .banner--success {
        background: #f0fdf4;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
    `,
  ],
})
export class LoginPageComponent {
  private readonly facade = inject(IamFacade);
  private readonly route = inject(ActivatedRoute);

  readonly serverError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly registered = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor() {
    this.route.queryParamMap
      .pipe(map((params) => params.get('registered') === 'true'))
      .subscribe((show) => this.registered.set(show));
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.serverError.set(null);

    this.facade.login(this.form.value as SignInRequest).subscribe({
      error: (err) => {
        this.isSubmitting.set(false);
        this.serverError.set(this.#extractMessage(err));
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  #extractMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return 'auth.errors.loginFailed';
  }
}
