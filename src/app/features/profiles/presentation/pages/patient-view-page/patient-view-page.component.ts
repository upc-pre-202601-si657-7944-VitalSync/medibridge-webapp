import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilesContextStore, ProfilesFacade } from '../../../application';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';
import type { Patient } from '../../../domain';

@Component({
  selector: 'app-patient-view-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page-container">
      <h1>{{ 'profiles.patient.title' | translate }}</h1>

      @if (patient()) {
        <div class="patient-card">
          <app-icon name="heart" [size]="40" />
          <h2>{{ patient()!.fullName }}</h2>
          <p class="patient-meta">{{ 'profiles.patient.description' | translate }}</p>
        </div>
      } @else if (loadError()) {
        <p>{{ loadError()! | translate }}</p>
      } @else if (!familyMemberProfileId()) {
        <div class="placeholder">
          <app-icon name="heart" [size]="48" />
          <p>{{ 'profiles.patient.profileRequired' | translate }}</p>
        </div>
      } @else if (!linkedPatientId()) {
        <div class="placeholder">
          <app-icon name="heart" [size]="48" />
          <p>{{ 'profiles.patient.empty' | translate }}</p>
        </div>
        <form [formGroup]="linkForm" (ngSubmit)="onLinkPatient()" class="link-form">
          <label for="patientId">{{ 'profiles.patient.manualLinkLabel' | translate }}</label>
          <input id="patientId" formControlName="patientId" placeholder="ID del paciente" />
          <button type="submit" [disabled]="linkForm.invalid || isLinking()">
            {{ isLinking() ? ('profiles.common.saving' | translate) : ('profiles.patient.linkSubmit' | translate) }}
          </button>
        </form>
      } @else {
        <p>{{ emptyStateKey() | translate }}</p>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 600px; margin: 0 auto; }
    .patient-card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    .patient-card h2 { margin-top: 1rem; font-size: 1.5rem; color: #0f172a; }
    .patient-meta { color: #64748b; margin-top: 0.5rem; }
    .placeholder { text-align: center; padding: 3rem 1rem; color: #94a3b8; }
    .placeholder p { margin-top: 1rem; font-size: 1rem; }
    .link-form { display: grid; gap: 0.75rem; max-width: 22rem; margin-top: 1rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-family: inherit; font-size: 1rem; }
    button { width: fit-content; padding: 0.75rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.75rem; cursor: pointer; font-family: inherit; font-weight: 600; }
  `]
})
export class PatientViewPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProfilesFacade);
  private readonly contextStore = inject(ProfilesContextStore);

  readonly patient = signal<Patient | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly isLinking = signal(false);
  readonly familyMemberProfileId = this.contextStore.familyMemberProfileId;
  readonly linkedPatientId = this.contextStore.linkedPatientId;

  readonly linkForm = inject(FormBuilder).nonNullable.group({
    patientId: ['', Validators.required],
  });

  emptyStateKey() {
    return this.resolvedPatientId()
      ? 'profiles.patient.loading'
      : 'profiles.patient.empty';
  }

  resolvedPatientId(): number | null {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) return Number(routeId);
    return this.linkedPatientId();
  }

  ngOnInit(): void {
    const patientId = this.resolvedPatientId();
    if (patientId) {
      this.facade.getPatient(patientId).subscribe({
        next: (data) => this.patient.set(data),
        error: () => this.loadError.set('profiles.errors.patientLoadFailed'),
      });
    }
  }

  onLinkPatient(): void {
    if (this.linkForm.invalid || this.isLinking() || !this.familyMemberProfileId()) return;

    const patientId = Number(this.linkForm.getRawValue().patientId);
    this.isLinking.set(true);
    this.loadError.set(null);

    this.facade.linkFamilyToPatient(patientId, this.familyMemberProfileId()!).subscribe({
      next: () => {
        this.contextStore.setLinkedPatientId(patientId);
        this.facade.getPatient(patientId).subscribe({
          next: (data) => this.patient.set(data),
          error: () => this.loadError.set('profiles.errors.patientLoadFailed'),
          complete: () => this.isLinking.set(false),
        });
      },
      error: () => {
        this.isLinking.set(false);
        this.loadError.set('profiles.errors.patientLinkFailed');
      },
    });
  }
}
