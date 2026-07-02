import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilesFacade } from '../../../application';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';
import type { Doctor } from '../../../domain';

@Component({
  selector: 'app-doctor-view-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page-container">
      <h1>{{ 'profiles.doctor.title' | translate }}</h1>

      @if (doctor()) {
        <div class="doctor-card">
          <app-icon name="stethoscope" [size]="40" />
          <h2>{{ doctor()!.fullName }}</h2>
          <p class="doctor-meta">{{ 'profiles.doctor.description' | translate }}</p>
        </div>
      } @else if (loadError()) {
        <p>{{ loadError()! | translate }}</p>
      } @else if (doctorId()) {
        <div class="placeholder">
          <app-icon name="stethoscope" [size]="48" />
          <p>{{ 'profiles.doctor.loading' | translate }}</p>
        </div>
      } @else {
        <div class="placeholder">
          <app-icon name="stethoscope" [size]="48" />
          <p>{{ 'profiles.doctor.empty' | translate }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 600px; margin: 0 auto; }
    .doctor-card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    .doctor-card h2 { margin-top: 1rem; font-size: 1.5rem; color: #0f172a; }
    .doctor-meta { color: #64748b; margin-top: 0.5rem; }
    .placeholder { text-align: center; padding: 3rem 1rem; color: #94a3b8; }
    .placeholder p { margin-top: 1rem; font-size: 1rem; }
  `]
})
export class DoctorViewPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProfilesFacade);

  readonly doctor = signal<Doctor | null>(null);
  readonly loadError = signal<string | null>(null);

  doctorId(): number | null {
    const routeId = this.route.snapshot.paramMap.get('id');
    return routeId ? Number(routeId) : null;
  }

  ngOnInit(): void {
    const id = this.doctorId();
    if (id) {
      this.facade.getDoctor(id).subscribe({
        next: (data) => this.doctor.set(data),
        error: () => this.loadError.set('profiles.errors.doctorLoadFailed'),
      });
    }
  }
}
