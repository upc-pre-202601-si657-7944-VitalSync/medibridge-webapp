import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfilesContextStore } from '../../../application';
import { AppointmentsApiService, type Appointment } from '../../../infrastructure/api/appointments/appointments-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Citas</h1>

      <section class="section">
        <h2>Agendar Visita Familiar</h2>
        <form [formGroup]="form" (ngSubmit)="onSchedule()" class="form-grid">
          <input formControlName="startsAt" placeholder="Fecha (YYYY-MM-DDTHH:mm)" />
          <input formControlName="durationInMinutes" type="number" placeholder="Duración (min)" />
          <input formControlName="reason" placeholder="Motivo" />
          <button type="submit" [disabled]="form.invalid || isSubmitting()">Agendar</button>
        </form>
        @if (scheduleError()) { <p class="error">{{ scheduleError() }}</p> }
      </section>

      <section class="section">
        <h2>Próximas Citas</h2>
        @if (loading()) {
          <p class="muted">Cargando...</p>
        } @else if (appointments().length === 0) {
          <div class="empty"><app-icon name="calendar" [size]="40" /><p>No hay citas programadas</p></div>
        } @else {
          <div class="list">
            @for (a of appointments(); track a.id) {
              <div class="card">
                <div class="card-header">
                  <app-icon name="calendar" [size]="20" />
                  <span class="type">{{ a.appointmentType === 'FAMILY_VISIT' ? 'Visita Familiar' : 'Cita Médica' }}</span>
                  <span class="status" [class]="a.status">{{ a.status }}</span>
                </div>
                <p class="reason">{{ a.reason }}</p>
                <p class="time">{{ a.startsAt }} — {{ a.endsAt }}</p>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }
    h2 { font-size: 1.125rem; font-weight: 600; color: #334155; margin-bottom: 1rem; }
    .section { margin-bottom: 2rem; background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .form-grid { display: grid; gap: 0.75rem; }
    input { padding: 0.625rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-family: inherit; font-size: 0.875rem; }
    button { padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
    .error { color: #dc2626; font-size: 0.8125rem; margin-top: 0.5rem; }
    .muted { color: #94a3b8; }
    .empty { text-align: center; padding: 2rem; color: #94a3b8; }
    .list { display: grid; gap: 0.75rem; }
    .card { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.625rem; }
    .card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .type { font-weight: 600; font-size: 0.875rem; color: #0f172a; }
    .status { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 1rem; background: #dbeafe; color: #1d4ed8; }
    .reason { font-size: 0.875rem; color: #475569; margin: 0 0 0.25rem; }
    .time { font-size: 0.8125rem; color: #94a3b8; margin: 0; }
  `]
})
export class AppointmentsPageComponent implements OnInit {
  private readonly api = inject(AppointmentsApiService);
  private readonly context = inject(ProfilesContextStore);

  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly isSubmitting = signal(false);
  readonly scheduleError = signal<string | null>(null);

  readonly form = inject(FormBuilder).nonNullable.group({
    startsAt: ['', Validators.required],
    durationInMinutes: [60, Validators.required],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    const pid = this.context.linkedPatientId();
    if (pid) this.#load(pid); else this.loading.set(false);
  }

  #load(patientId: number): void {
    this.api.getByPatient(patientId).subscribe({
      next: (data) => this.appointments.set(data),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  onSchedule(): void {
    const pid = this.context.linkedPatientId();
    const fid = this.context.familyMemberProfileId();
    if (!pid || !fid || this.form.invalid) return;

    this.isSubmitting.set(true);
    const v = this.form.getRawValue();
    this.api.scheduleFamilyVisit({
      patientId: pid,
      familyMemberProfileId: fid,
      startsAt: v.startsAt!,
      durationInMinutes: Number(v.durationInMinutes),
      reason: v.reason!,
    }).subscribe({
      next: () => { this.form.reset({ startsAt: '', durationInMinutes: 60, reason: '' }); this.#load(pid); },
      error: () => this.scheduleError.set('Error al agendar la cita'),
      complete: () => this.isSubmitting.set(false),
    });
  }
}
