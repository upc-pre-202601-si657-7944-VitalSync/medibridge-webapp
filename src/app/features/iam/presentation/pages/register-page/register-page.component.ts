import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IamFacade } from '../../../application';
import { UserRole, type SignUpRequest } from '../../../domain';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styles: [
    `
      /* ── Page shell ── */
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        background-color: #f8fafc;
      }

      .iam-shell {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        width: 100%;
        max-width: 90rem;
        border-radius: 1.5rem;
        background: #fff;
        box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.06),
          0 0.5rem 4rem rgba(0, 0, 0, 0.04);
        overflow: hidden;
      }

      /* ── Brand panel ── */
      .brand {
        background: linear-gradient(160deg, #2563eb 0%, #1d4ed8 40%, #0f766e 100%);
        color: #fff;
        display: flex;
        align-items: center;
      }

      .brand-inner {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4rem;
        width: 100%;
        min-height: 100%;
      }

      .logo-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo-name {
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .brand-body {
        margin: auto 0;
      }

      .brand-headline {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 1rem;
        letter-spacing: -0.02em;
      }

      .brand-desc {
        font-size: 1rem;
        line-height: 1.6;
        opacity: 0.85;
        margin: 0 0 2.5rem;
        max-width: 24rem;
      }

      .trust-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .trust-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.9375rem;
        line-height: 1.5;
        opacity: 0.9;
      }

      .trust-marker {
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .brand-footer {
        opacity: 0.45;
        font-size: 0.8125rem;
      }

      /* ── Form panel ── */
      .form-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem;
      }

      .form-wrap {
        width: 100%;
        max-width: 28rem;
      }

      .form-header {
        margin-bottom: 2rem;
      }

      .form-eyebrow {
        font-size: 0.875rem;
        font-weight: 600;
        color: #2563eb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 0.5rem;
      }

      .form-title {
        font-size: 2rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.2;
        margin: 0 0 0.75rem;
      }

      .form-support {
        font-size: 1rem;
        color: #475569;
        margin: 0;
      }

      /* ── Banners ── */
      .banner {
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }

      .banner--error {
        background: #fef2f2;
        color: #991b1b;
        border: 1px solid #fecaca;
      }

      /* ── Fields ── */
      .field {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.5rem;
      }

      input,
      select {
        width: 100%;
        height: 3.25rem;
        padding-inline: 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.875rem;
        font-size: 1rem;
        font-family: inherit;
        background: #f8fafc;
        color: #0f172a;
        transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        box-sizing: border-box;
      }

      select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
        cursor: pointer;
      }

      input::placeholder,
      select:invalid {
        color: #94a3b8;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        background: #fff;
      }

      input.ng-invalid.ng-touched,
      select.ng-invalid.ng-touched {
        border-color: #dc2626;
      }

      input.ng-invalid.ng-touched:focus,
      select.ng-invalid.ng-touched:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
      }

      .field-error {
        color: #dc2626;
        font-size: 0.8125rem;
        margin-top: 0.375rem;
      }

      .field-hint {
        font-size: 0.8125rem;
        color: #94a3b8;
        margin-top: 0.375rem;
      }

      /* ── Button ── */
      button {
        width: 100%;
        height: 3.5rem;
        padding: 0;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 1rem;
        font-size: 1rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, transform 0.1s;
        margin-top: 0.5rem;
      }

      button:hover:not(:disabled) {
        background: #1d4ed8;
      }

      button:active:not(:disabled) {
        transform: scale(0.995);
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      /* ── Footer ── */
      .form-footer {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 0.9375rem;
        color: #475569;
      }

      .form-footer a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }

      .form-footer a:hover {
        text-decoration: underline;
      }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        :host {
          padding: 1rem;
        }

        .iam-shell {
          grid-template-columns: 1fr;
          border-radius: 1.25rem;
        }

        .brand {
          display: none;
        }

        .form-panel {
          padding: 2rem 1.5rem;
        }

        .form-title {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class RegisterPageComponent {
  private readonly facade = inject(IamFacade);

  readonly serverError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: [UserRole.PATIENT, [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const data = this.form.value as SignUpRequest;

    this.facade.register(data).subscribe({
      error: (err) => {
        this.isSubmitting.set(false);
        this.serverError.set(this.#extractMessage(err));
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  #extractMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return 'Registration failed. Please try again.';
  }
}
