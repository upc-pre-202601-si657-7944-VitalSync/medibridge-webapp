import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, type IconName } from '../../shared/icon.component';
import { SharedI18nModule } from '../../shared/shared-i18n.module';
import { IamFacade } from '../../features/iam/application';

interface SidebarItem {
  labelKey: string;
  icon: IconName;
  route: string;
}

@Component({
  selector: 'app-family-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SharedI18nModule, IconComponent],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <span class="logo">MediBridge</span>
      </div>

      <ul class="nav-list">
        @for (item of menuItems; track item.route) {
          <li>
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.route === '/profiles/dashboard' }"
              class="nav-link"
            >
              <app-icon [name]="item.icon" [size]="18" />
              <span class="label">{{ item.labelKey | translate }}</span>
            </a>
          </li>
        }
      </ul>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <app-icon name="log-out" [size]="18" />
          <span class="label">{{ 'auth.home.logout' | translate }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #1e2937;
    }

    .sidebar-header {
      flex-shrink: 0;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #1e2937;
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563eb;
    }

    .nav-list {
      list-style: none;
      padding: 0.5rem 0;
      margin: 0;
      flex: 1;
      overflow-y: auto;
    }

    .nav-list::-webkit-scrollbar {
      width: 4px;
    }

    .nav-list::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 2px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .nav-link:hover {
      background: #1e2937;
      color: #e2e8f0;
    }

    .nav-link.active {
      background: #2563eb;
      color: white;
      border-radius: 0 9999px 9999px 0;
      margin-right: 0.5rem;
    }

    .label {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.25;
    }

    .sidebar-footer {
      flex-shrink: 0;
      padding: 0.75rem;
      border-top: 1px solid #1e2937;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      border-radius: 0.5rem;
      color: #94a3b8;
      font-family: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .logout-btn:hover {
      background: #1e2937;
      color: #fca5a5;
    }
  `]
})
export class FamilySidebarComponent {
  private readonly iamFacade = inject(IamFacade);

  readonly menuItems: SidebarItem[] = [
    { labelKey: 'profiles.sidebar.dashboard', icon: 'dashboard', route: '/profiles/dashboard' },
    { labelKey: 'profiles.sidebar.familyProfile', icon: 'user', route: '/profiles/family-profile' },
    { labelKey: 'profiles.sidebar.patient', icon: 'heart', route: '/profiles/patient' },
    { labelKey: 'profiles.sidebar.appointments', icon: 'calendar', route: '/profiles/appointments' },
    { labelKey: 'profiles.sidebar.medication', icon: 'pill', route: '/profiles/medication' },
    { labelKey: 'profiles.sidebar.monitoring', icon: 'activity', route: '/profiles/monitoring' },
    { labelKey: 'profiles.sidebar.messages', icon: 'message-circle', route: '/profiles/messages' },
    { labelKey: 'profiles.sidebar.reports', icon: 'file-text', route: '/profiles/reports' },
    { labelKey: 'profiles.sidebar.payments', icon: 'credit-card', route: '/profiles/payments' },
    { labelKey: 'profiles.sidebar.settings', icon: 'settings', route: '/profiles/settings' },
  ];

  logout(): void {
    this.iamFacade.logout();
  }
}
