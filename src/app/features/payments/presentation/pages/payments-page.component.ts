import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../core/auth/auth.store';
import { PaymentsApiService, type Subscription, type Invoice } from '../../infrastructure/api/payments-api\.service';
import { SharedI18nModule } from '../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../shared/icon.component';

@Component({
  selector: 'app-payments-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Pagos y Suscripción</h1>

      <section class="section">
        <h2>Suscripción Activa</h2>
        @if (loading()) { <p class="muted">Cargando...</p> }
        @else if (subscription()) {
          <div class="sub-card">
            <app-icon name="credit-card" [size]="32" />
            <div>
              <strong>{{ subscription()!.plan.displayName }}</strong>
              <span>{{ subscription()!.plan.commercialLine }} — {{ subscription()!.status }}</span>
              <span>Vence: {{ subscription()!.currentPeriodEnd }}</span>
              <span class="price">{{ subscription()!.plan.price }} {{ subscription()!.plan.currency }}/{{ subscription()!.plan.billingCycle }}</span>
            </div>
          </div>
        } @else {
          <p class="muted">Sin suscripción activa</p>
        }
      </section>

      <section class="section">
        <h2>Facturas</h2>
        @if (invoices().length === 0) {
          <p class="muted">No hay facturas</p>
        } @else {
          @for (inv of invoices(); track inv.id) {
            <div class="card">
              <span>{{ inv.issuedAt }}</span>
              <strong>{{ inv.amount }} {{ inv.currency }}</strong>
              <span class="status">{{ inv.status }}</span>
            </div>
          }
        }
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }
    h2 { font-size: 1.125rem; font-weight: 600; color: #334155; margin-bottom: 1rem; }
    .section { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 1.5rem; }
    .muted { color: #94a3b8; font-size: 0.875rem; }
    .sub-card { display: flex; gap: 1rem; align-items: center; }
    .sub-card div { display: flex; flex-direction: column; gap: 0.25rem; }
    .sub-card strong { font-size: 1.125rem; color: #0f172a; }
    .sub-card span { font-size: 0.8125rem; color: #64748b; }
    .price { font-size: 1.25rem; font-weight: 700; color: #2563eb !important; margin-top: 0.5rem; }
    .card { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .card strong { color: #0f172a; }
    .status { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 1rem; background: #dbeafe; color: #1d4ed8; }
  `]
})
export class PaymentsPageComponent implements OnInit {
  private readonly api = inject(PaymentsApiService);
  private readonly auth = inject(AuthStore);
  readonly subscription = signal<Subscription | null>(null);
  readonly invoices = signal<Invoice[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    const userId = user ? Number(user.id) : 3;
    this.api.getActiveSubscription(userId).subscribe({
      next: (data) => this.subscription.set(data),
      error: () => {},
    });
    this.api.getInvoices(userId).subscribe({
      next: (data) => { this.invoices.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
