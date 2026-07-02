import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../../../../core/auth/auth.store';
import { CommunicationApiService, type Notification } from '../../../infrastructure/api/communication/communication-api.service';
import { SharedI18nModule } from '../../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../../shared/icon.component';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Mensajes y Notificaciones</h1>
      @if (loading()) { <p class="muted">Cargando...</p> }
      @else if (notifications().length === 0) {
        <div class="empty"><app-icon name="message-circle" [size]="48" /><p>No hay notificaciones</p></div>
      } @else {
        @for (n of notifications(); track n.id) {
          <div class="card" [class.unread]="n.status === 'UNREAD'" (click)="markRead(n.id)">
            <app-icon name="message-circle" [size]="20" />
            <div class="content">
              <div class="header">
                <span class="type">{{ n.type }}</span>
                @if (n.status === 'UNREAD') { <span class="dot"></span> }
              </div>
              <strong>{{ n.title }}</strong>
              <p>{{ n.message }}</p>
              <span class="date">{{ n.createdAt }}</span>
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
    .card { display: flex; gap: 1rem; background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); margin-bottom: 0.75rem; cursor: pointer; }
    .card.unread { border-left: 3px solid #2563eb; }
    .content { flex: 1; }
    .header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .type { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; padding: 0.125rem 0.5rem; border-radius: 0.25rem; color: #64748b; }
    .dot { width: 6px; height: 6px; background: #2563eb; border-radius: 50%; }
    strong { display: block; font-size: 0.9375rem; color: #0f172a; }
    p { font-size: 0.8125rem; color: #475569; margin: 0.25rem 0; }
    .date { font-size: 0.6875rem; color: #94a3b8; }
  `]
})
export class MessagesPageComponent implements OnInit {
  private readonly api = inject(CommunicationApiService);
  private readonly auth = inject(AuthStore);
  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    const userId = user ? Number(user.id) : 3;
    this.api.getNotifications(userId).subscribe({
      next: (data) => { this.notifications.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  markRead(id: string): void {
    this.api.markAsRead(id).subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => n.id === id ? { ...n, status: 'READ' } : n));
      },
      error: () => {},
    });
  }
}
