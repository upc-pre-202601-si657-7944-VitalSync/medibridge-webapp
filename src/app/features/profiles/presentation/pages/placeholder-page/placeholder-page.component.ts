import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent, type IconName } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [SharedI18nModule, IconComponent],
  template: `
    <div class="placeholder">
      <app-icon [name]="icon" [size]="64" />
      <h2>{{ titleKey | translate }}</h2>
      <p>{{ descKey | translate }}</p>
    </div>
  `,
  styles: [`
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      color: #94a3b8;
    }
    h2 {
      margin-top: 1.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #475569;
    }
    p {
      margin-top: 0.5rem;
      font-size: 1rem;
      max-width: 20rem;
    }
  `]
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  get icon(): IconName {
    return (this.route.snapshot.data['icon'] as IconName) ?? 'dashboard';
  }

  get titleKey(): string {
    return (this.route.snapshot.data['titleKey'] as string) ?? 'profiles.sidebar.dashboard';
  }

  get descKey(): string {
    return (this.route.snapshot.data['descKey'] as string) ?? 'profiles.placeholder.comingSoon';
  }
}
