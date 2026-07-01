import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IamFacade } from '../../../application';
import { iamAuthSharedStyles } from '../../iam-auth-shared.styles';
import { TranslatePipe } from '../../../../../../app/i18n/translate.pipe';
import { LanguageToggleComponent } from '../../../../../../app/shared/language-toggle/language-toggle.component';
import { UserRole, type SignUpRequest } from '../../../domain';
import { mapFrontendRoleToBackend } from '../../../domain/role-mapping';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, LanguageToggleComponent],
  templateUrl: './register-page.component.html',
  styles: [
    iamAuthSharedStyles,
    `
      /* ── Register-specific ── */
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
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
        cursor: pointer;
      }

      select:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        background: #fff;
      }

      select.ng-invalid.ng-touched {
        border-color: #dc2626;
      }

      select.ng-invalid.ng-touched:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
      }

      .field-hint {
        font-size: 0.8125rem;
        color: #94a3b8;
        margin-top: 0.375rem;
      }
    `,
  ],
})
export class RegisterPageComponent {
  private readonly facade = inject(IamFacade);

  readonly registrationRoleOptions = [
    {
      value: UserRole.FAMILY_MEMBER,
      labelKey: 'auth.register.segments.familySupportNetwork',
    },
    {
      value: UserRole.CAREGIVER,
      labelKey: 'auth.register.segments.careStaff',
    },
  ] as const;

  readonly serverError = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    selectedRole: [UserRole.FAMILY_MEMBER, [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const formValue = this.form.value;
    const data: SignUpRequest = {
      username: formValue.username!,
      password: formValue.password!,
      roles: [mapFrontendRoleToBackend(formValue.selectedRole!)],
      frontendRole: formValue.selectedRole!,
    };

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
    return 'auth.errors.registerFailed';
  }
}
