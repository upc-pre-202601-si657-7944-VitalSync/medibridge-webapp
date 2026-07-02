import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesContextStore } from '../../../application';
import { MedicationApiService, type Medication } from '../../../infrastructure/api/medication/medication-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-medication-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Medicaci&oacute;n</h1>
      @if (loading()) { <p class="muted">Cargando...</p> }
      @else if (medications().length === 0) {
        <div class="empty"><app-icon name="pill" [size]="48" /><p>No hay medicamentos registrados</p></div>
      } @else {
        @for (m of medications(); track m.id) {
          <div class="card">
            <app-icon name="pill" [size]="24" />
            <div class="info">
              <strong>{{ m.name }}</strong>
              <span>{{ m.dosageAmount }} {{ m.dosageUnit }} &mdash; {{ m.administrationRoute }}</span>
              <span class="stock">Stock: {{ m.stockQuantity }} (alerta: {{ m.lowStockThreshold }})</span>
              @if (m.expirationDate) { <span class="expiry">Vence: {{ m.expirationDate }}</span> }
            </div>
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
    .card { display: flex; align-items: flex-start; gap: 1rem; background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 0.75rem; }
    .info { display: flex; flex-direction: column; gap: 0.25rem; }
    .info strong { color: #0f172a; }
    .info span { font-size: 0.8125rem; color: #64748b; }
    .stock { color: #2563eb; font-weight: 600; }
    .schedule { color: #059669; }
  `]
})
export class MedicationPageComponent implements OnInit {
  private readonly api = inject(MedicationApiService);
  private readonly context = inject(ProfilesContextStore);
  readonly medications = signal<Medication[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const pid = this.context.linkedPatientId();
    if (pid) {
      this.api.getByPatient(pid).subscribe({
        next: (data) => { this.medications.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else { this.loading.set(false); }
  }
}
