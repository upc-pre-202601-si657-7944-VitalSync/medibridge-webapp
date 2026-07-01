import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfilesFacade } from '../../../application';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import type { Doctor } from '../../../domain';

@Component({
  selector: 'app-doctor-view-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule],
  template: `
    <div class="page-container">
      <h1>{{ 'profiles.doctor.title' | translate }}</h1>
      @if (doctor()) {
        <div class="doctor-card">
          <h2>{{ doctor()!.fullName }}</h2>
        </div>
      } @else if (loadError()) {
        <p>{{ loadError()! | translate }}</p>
      } @else {
        <p>{{ 'profiles.doctor.backendGap' | translate }}</p>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; max-width: 600px; margin: 0 auto; }
    .doctor-card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  `]
})
export class DoctorViewPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProfilesFacade);

  readonly doctor = signal<Doctor | null>(null);
  readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.facade.getDoctor(Number(doctorId)).subscribe({
        next: (data) => this.doctor.set(data),
        error: () => this.loadError.set('profiles.errors.doctorLoadFailed'),
      });
    }
  }
}
