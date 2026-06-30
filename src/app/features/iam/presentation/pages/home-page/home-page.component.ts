import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../../../core/auth/auth.store';
import { IamFacade } from '../../../application';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SharedI18nModule],
  templateUrl: './home-page.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
        background-color: #f8fafc;
      }

      .home-card {
        background: #fff;
        border-radius: 1.5rem;
        padding: 3rem 2.5rem;
        width: 100%;
        max-width: 30rem;
        text-align: center;
        box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.06),
          0 0.5rem 4rem rgba(0, 0, 0, 0.04);
      }

      .home-header {
        margin-bottom: 1.5rem;
      }

      .home-greeting {
        margin: 0 0 0.75rem;
        font-size: 1.75rem;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.02em;
      }

      .home-role {
        display: inline-block;
        background: #eff6ff;
        color: #2563eb;
        padding: 0.375rem 1rem;
        border-radius: 2rem;
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: capitalize;
      }

      .home-info {
        font-size: 0.9375rem;
        color: #475569;
        margin: 0 0 2rem;
        line-height: 1.6;
      }

      .home-info strong {
        color: #0f172a;
      }

      .logout-btn {
        width: 100%;
        height: 3rem;
        padding: 0;
        background: transparent;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: 0.875rem;
        font-size: 0.9375rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
      }

      .logout-btn:hover {
        background: #fef2f2;
        border-color: #fca5a5;
      }

      .logout-btn:active {
        background: #fee2e2;
      }
    `,
  ],
})
export class HomePageComponent {
  readonly authStore = inject(AuthStore);
  private readonly facade = inject(IamFacade);

  logout(): void {
    this.facade.logout();
  }
}
