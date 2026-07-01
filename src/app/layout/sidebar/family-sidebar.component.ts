import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SharedI18nModule } from '../../shared/shared-i18n.module';

interface SidebarItem {
  labelKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-family-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SharedI18nModule],
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
              class="nav-link"
            >
              <span class="icon">{{ item.icon }}</span>
              <span class="label">{{ item.labelKey | translate }}</span>
            </a>
          </li>
        }
      </ul>
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
      padding: 1.5rem;
      border-bottom: 1px solid #1e2937;
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563eb;
    }

    .nav-list {
      list-style: none;
      padding: 1rem 0;
      margin: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
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

    .icon {
      font-size: 1.125rem;
    }

    .label {
      font-size: 0.9375rem;
      font-weight: 500;
    }
  `]
})
export class FamilySidebarComponent {
  readonly menuItems: SidebarItem[] = [
    { labelKey: 'profiles.sidebar.familyProfile', icon: '👤', route: '/profiles/family-profile' },
    { labelKey: 'profiles.sidebar.patient', icon: '🧑‍⚕️', route: '/profiles/patient' },
    { labelKey: 'profiles.sidebar.doctor', icon: '🩺', route: '/profiles/doctor' },
  ];
}
