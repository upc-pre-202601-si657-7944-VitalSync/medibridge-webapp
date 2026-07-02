import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilesContextStore } from '../../../application';
import { ReportsApiService, type ClinicalReport } from '../../../infrastructure/api/reports/reports-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Reportes Clínicos</h1>

      <div class="gen-form">
        <select [(ngModel)]="reportType">
          <option value="VITAL_SIGNS">Signos Vitales</option>
          <option value="MEDICATION">Medicación</option>
          <option value="FULL_CLINICAL">Clínico Completo</option>
        </select>
        <button (click)="onGenerate()" [disabled]="isGenerating()">Generar Reporte</button>
        @if (genError()) { <p class="error">{{ genError() }}</p> }
      </div>

      <h2>Reportes del Paciente</h2>
      @if (loading()) { <p class="muted">Cargando...</p> }
      @else if (reports().length === 0) {
        <div class="empty"><app-icon name="file-text" [size]="48" /><p>No hay reportes generados</p></div>
      } @else {
        @for (r of reports(); track r.id) {
          <div class="card">
            <app-icon name="file-text" [size]="24" />
            <div class="info">
              <strong>{{ r.reportType }}</strong>
              <span>{{ r.periodStartDate }} — {{ r.periodEndDate }}</span>
              <p class="summary">{{ r.summary }}</p>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }
    h2 { font-size: 1.125rem; font-weight: 600; color: #334155; margin: 1.5rem 0 1rem; }
    .muted { color: #94a3b8; text-align: center; padding: 2rem; }
    .empty { text-align: center; padding: 3rem; color: #94a3b8; }
    .gen-form { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    select { padding: 0.625rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-family: inherit; }
    button { padding: 0.625rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
    .error { color: #dc2626; font-size: 0.8125rem; margin-top: 0.25rem; }
    .card { display: flex; gap: 1rem; background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 0.75rem; }
    .info strong { color: #0f172a; display: block; }
    .info span { font-size: 0.8125rem; color: #64748b; }
    .summary { font-size: 0.8125rem; color: #475569; margin-top: 0.5rem; }
  `]
})
export class ReportsPageComponent implements OnInit {
  private readonly api = inject(ReportsApiService);
  private readonly context = inject(ProfilesContextStore);
  readonly reports = signal<ClinicalReport[]>([]);
  readonly loading = signal(true);
  readonly isGenerating = signal(false);
  readonly genError = signal<string | null>(null);
  reportType = 'VITAL_SIGNS';

  ngOnInit(): void {
    const pid = this.context.linkedPatientId();
    if (pid) {
      this.api.getReportsByPatient(pid).subscribe({
        next: (data) => { this.reports.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else { this.loading.set(false); }
  }

  onGenerate(): void {
    const pid = this.context.linkedPatientId();
    if (!pid) return;
    this.isGenerating.set(true);
    const now = new Date().toISOString().split('T')[0];
    this.api.generateReport({ patientId: pid, reportType: this.reportType, startDate: '2026-01-01', endDate: now }).subscribe({
      next: (r) => { this.reports.update(l => [...l, r]); },
      error: () => this.genError.set('Error al generar el reporte'),
      complete: () => this.isGenerating.set(false),
    });
  }
}
