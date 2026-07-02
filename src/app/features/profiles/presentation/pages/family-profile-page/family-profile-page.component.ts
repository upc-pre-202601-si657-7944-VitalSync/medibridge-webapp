import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ProfilesContextStore,
  ProfilesFacade,
  type CreateFamilyMemberData,
} from '../../../application';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';

@Component({
  selector: 'app-family-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, SharedI18nModule],
  template: `
    <div class="page-container">
      <h1>{{ 'profiles.family.title' | translate }}</h1>

      @if (serverError()) {
        <div class="banner banner--error">{{ serverError()! | translate }}</div>
      }

      @if (familyProfileId()) {
        <div class="banner banner--success">{{ 'profiles.family.created' | translate }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="fullName">{{ 'profiles.family.fullName' | translate }}</label>
          <input id="fullName" formControlName="fullName" />
        </div>

        <button type="submit" [disabled]="form.invalid || isSubmitting()">
          {{ isSubmitting() ? ('profiles.common.saving' | translate) : ('profiles.family.submit' | translate) }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .page-container { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; }
    button { width: 100%; padding: 0.875rem; background: #2563eb; color: white; border: none; border-radius: 0.75rem; cursor: pointer; }
    .banner { padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
    .banner--error { background: #fef2f2; color: #991b1b; }
    .banner--success { background: #f0fdf4; color: #166534; }
  `]
})
export class FamilyProfilePageComponent {
  private readonly facade = inject(ProfilesFacade);
  private readonly contextStore = inject(ProfilesContextStore);

  readonly serverError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly familyProfileId = this.contextStore.familyMemberProfileId;

  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.serverError.set(null);

    const formValue = this.form.getRawValue();
    const data: CreateFamilyMemberData = {
      fullName: formValue.fullName!,
    };

    this.facade.createFamilyMember(data).subscribe({
      next: (familyMember) => {
        this.contextStore.setFamilyMemberProfileId(familyMember.id);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.serverError.set('profiles.errors.createFailed');
      },
      complete: () => this.isSubmitting.set(false),
    });
  }
}
