import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ProfilesContextStore,
  ProfilesFacade,
  type CreateFamilyMemberData,
} from '../../../application';
import type { FamilyMember } from '../../../domain';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-family-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page-container">
      <h1>{{ 'profiles.family.title' | translate }}</h1>

      @if (loadError()) {
        <div class="banner banner--error">{{ loadError()! | translate }}</div>
      }

      @if (serverError()) {
        <div class="banner banner--error">{{ serverError()! | translate }}</div>
      }

      @if (isLoading()) {
        <div class="loading">
          <p>{{ 'profiles.common.saving' | translate }}</p>
        </div>
      } @else if (profile()) {
        <div class="profile-card">
          <app-icon name="user" [size]="48" />
          <h2>{{ profile()!.fullName }}</h2>
          <dl class="profile-details">
            <div>
              <dt>ID Perfil</dt>
              <dd>{{ profile()!.id }}</dd>
            </div>
            <div>
              <dt>Usuario ID</dt>
              <dd>{{ profile()!.userId }}</dd>
            </div>
          </dl>
          <div class="banner banner--success">{{ 'profiles.family.created' | translate }}</div>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="fullName">{{ 'profiles.family.fullName' | translate }}</label>
            <input id="fullName" formControlName="fullName" [placeholder]="'profiles.family.fullName' | translate" />
            @if (form.controls.fullName.touched && form.controls.fullName.hasError('required')) {
              <div class="field-error">Full name is required</div>
            }
          </div>

          <button type="submit" [disabled]="form.invalid || isSubmitting()">
            {{ isSubmitting() ? ('profiles.common.saving' | translate) : ('profiles.family.submit' | translate) }}
          </button>
        </form>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 560px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
      text-align: center;
    }
    .profile-card h2 { margin-top: 1rem; font-size: 1.375rem; color: #0f172a; }

    .profile-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1.5rem 0;
      text-align: left;
    }
    .profile-details dt { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
    .profile-details dd { font-size: 1rem; color: #0f172a; font-weight: 600; margin: 0; }

    .loading { text-align: center; padding: 3rem 1rem; color: #94a3b8; }

    .field { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; font-size: 0.875rem; }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.625rem;
      font-size: 1rem;
      font-family: inherit;
      background: #f8fafc;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); background: white; }
    .field-error { font-size: 0.8125rem; color: #dc2626; margin-top: 0.375rem; }

    button {
      width: 100%;
      padding: 0.875rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;
    }
    button:hover:not(:disabled) { background: #1d4ed8; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    .banner { padding: 0.875rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; }
    .banner--error { background: #fef2f2; color: #991b1b; }
    .banner--success { background: #f0fdf4; color: #166534; text-align: center; margin-top: 1.5rem; }
  `]
})
export class FamilyProfilePageComponent implements OnInit {
  private readonly facade = inject(ProfilesFacade);
  private readonly contextStore = inject(ProfilesContextStore);

  readonly profile = signal<FamilyMember | null>(null);
  readonly serverError = signal<string | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly familyProfileId = this.contextStore.familyMemberProfileId;

  readonly form = inject(FormBuilder).nonNullable.group({
    fullName: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.familyProfileId();
    if (id) {
      this.isLoading.set(true);
      this.facade.getFamilyMember(id).subscribe({
        next: (data) => {
          this.profile.set(data);
          this.contextStore.setFamilyMemberProfileId(data.id);
        },
        error: () => {
          this.loadError.set('profiles.errors.createFailed');
          this.contextStore.setFamilyMemberProfileId(id);
        },
        complete: () => this.isLoading.set(false),
      });
    }
  }

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
        this.profile.set(familyMember);
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
