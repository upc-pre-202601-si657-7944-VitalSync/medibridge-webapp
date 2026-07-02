import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../../core/auth/auth.store';
import { ProfilesContextStore } from '../../../application';
import { AppointmentsApiService } from '../../../infrastructure/api/appointments/appointments-api.service';
import { MedicationApiService } from '../../../infrastructure/api/medication/medication-api.service';
import { CommunicationApiService } from '../../../infrastructure/api/communication/communication-api.service';
import { HealthApiService } from '../../../infrastructure/api/health/health-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SharedI18nModule, IconComponent],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Resumen del estado de tu paciente</p>
      </header>

      @if (loading()) {
        <div class="loading">Cargando datos del dashboard...</div>
      } @else {
        <div class="cards">
          <div class="card">
            <app-icon name="calendar" [size]="28" />
            <span class="card-value">{{ appointmentCount() }}</span>
            <span class="card-label">Pr&oacute;ximas Citas</span>
            <a routerLink="/family/appointments" class="card-link">Ver todas</a>
          </div>
          <div class="card">
            <app-icon name="pill" [size]="28" />
            <span class="card-value">{{ medicationCount() }}</span>
            <span class="card-label">Medicamentos Activos</span>
            <a routerLink="/family/medication" class="card-link">Gestionar</a>
          </div>
          <div class="card">
            <app-icon name="activity" [size]="28" />
            <span class="card-value">{{ observationCount() }}</span>
            <span class="card-label">Observaciones</span>
            <a routerLink="/family/monitoring" class="card-link">Ver monitoreo</a>
          </div>
          <div class="card">
            <app-icon name="message-circle" [size]="28" />
            <span class="card-value">{{ unreadCount() }}</span>
            <span class="card-label">Notificaciones sin leer</span>
            <a routerLink="/family/messages" class="card-link">Ver mensajes</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; max-width: 960px; margin: 0 auto; }
    .dashboard-header { margin-bottom: 2rem; }
    .dashboard-header h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
    .subtitle { color: #64748b; margin: 0.25rem 0 0; font-size: 0.9375rem; }
    .loading { text-align: center; padding: 4rem 2rem; color: #94a3b8; }
    .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .card {
      background: white; padding: 1.5rem; border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }
    .card-value { font-size: 2rem; font-weight: 700; color: #0f172a; }
    .card-label { font-size: 0.8125rem; color: #64748b; font-weight: 500; }
    .card-link { font-size: 0.8125rem; color: #2563eb; text-decoration: none; font-weight: 600; margin-top: 0.25rem; }
    .card-link:hover { text-decoration: underline; }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthStore);
  private readonly context = inject(ProfilesContextStore);
  private readonly appointmentsApi = inject(AppointmentsApiService);
  private readonly medicationApi = inject(MedicationApiService);
  private readonly healthApi = inject(HealthApiService);
  private readonly commApi = inject(CommunicationApiService);

  readonly loading = signal(true);
  readonly appointmentCount = signal(0);
  readonly medicationCount = signal(0);
  readonly observationCount = signal(0);
  readonly unreadCount = signal(0);

  ngOnInit(): void {
    const patientId = this.context.linkedPatientId();
    if (patientId) {
      let loaded = 0; const total = 4;
      const done = () => { loaded++; if (loaded >= total) this.loading.set(false); };

      this.appointmentsApi.getByPatient(patientId).subscribe({ next: d => this.appointmentCount.set(d.length), error: () => done(), complete: done });
      this.medicationApi.getByPatient(patientId).subscribe({ next: d => this.medicationCount.set(d.filter(m => m.active).length), error: () => done(), complete: done });
      this.healthApi.getObservations(patientId).subscribe({ next: d => this.observationCount.set(d.length), error: () => done(), complete: done });
      const userId = Number(this.auth.currentUser()?.id ?? 3);
      this.commApi.getUnreadNotifications(userId).subscribe({ next: d => this.unreadCount.set(d.length), error: () => done(), complete: done });
    } else {
      this.loading.set(false);
    }
  }
}
