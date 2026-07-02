import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesContextStore } from '../../../application';
import { HealthApiService, type HealthObservation } from '../../../infrastructure/api/health/health-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-monitoring-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Monitoreo de Salud</h1>
      @if (loading()) { <p class="muted">Cargando...</p> }
      @else if (observations().length === 0) {
        <div class="empty"><app-icon name="activity" [size]="48" /><p>No hay observaciones registradas</p></div>
      } @else {
        @for (o of observations(); track o.id) {
          <div class="card">
            <div class="card-top">
              <app-icon name="activity" [size]="20" />
              <span class="date">{{ o.recordedAt }}</span>
            </div>
            <div class="vitals">
              <div class="vital">
                <app-icon name="heart" [size]="16" />
                <span>Presión: {{ o.systolicBloodPressure }}/{{ o.diastolicBloodPressure }} mmHg</span>
              </div>
              <div class="vital">
                <span class="label">Temperatura</span>
                <span>{{ o.bodyTemperature }}&deg;C</span>
              </div>
              <div class="vital">
                <span class="label">Dolor</span>
                <span>{{ o.painLevel }}/10</span>
              </div>
              <div class="vital">
                <span class="label">Estado</span>
                <span>{{ o.emotionalState }}</span>
              </div>
            </div>
            @if (o.clinicalNotes) { <p class="notes">{{ o.clinicalNotes }}</p> }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }
    .muted { color: #94a3b8; text-align: center; padding: 2rem; }
    .empty { text-align: center; padding: 3rem; color: #94a3b8; }
    .card { background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 0.75rem; }
    .card-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; }
    .date { font-size: 0.75rem; color: #94a3b8; }
    .vitals { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 0.75rem; }
    .vital { display: flex; align-items: center; gap: 0.5rem; }
    .vital span { font-size: 0.875rem; color: #334155; }
    .label { font-size: 0.75rem !important; color: #94a3b8 !important; text-transform: uppercase; letter-spacing: 0.05em; display: block; }
    .notes { font-size: 0.8125rem; color: #64748b; margin: 0; }
  `]
})
export class MonitoringPageComponent implements OnInit {
  private readonly api = inject(HealthApiService);
  private readonly context = inject(ProfilesContextStore);
  readonly observations = signal<HealthObservation[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const pid = this.context.linkedPatientId();
    if (pid) {
      this.api.getObservations(pid).subscribe({
        next: (data) => { this.observations.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else { this.loading.set(false); }
  }
}
