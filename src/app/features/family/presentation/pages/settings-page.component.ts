import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedI18nModule } from '../../../../shared/shared-i18n.module';
import { IconComponent } from '../../../../shared/icon.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, SharedI18nModule, IconComponent],
  template: `
    <div class="page">
      <h1>Configuración</h1>
      <div class="settings-grid">
        <div class="setting-card">
          <app-icon name="user" [size]="24" />
          <strong>Idioma</strong>
          <span>Español / English</span>
        </div>
        <div class="setting-card">
          <app-icon name="message-circle" [size]="24" />
          <strong>Notificaciones</strong>
          <span>Gestionar preferencias</span>
        </div>
        <div class="setting-card">
          <app-icon name="settings" [size]="24" />
          <strong>Privacidad</strong>
          <span>Control de datos</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 1.5rem; }
    .settings-grid { display: grid; gap: 1rem; }
    .setting-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.25rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); cursor: pointer; }
    .setting-card strong { color: #0f172a; display: block; }
    .setting-card span { font-size: 0.8125rem; color: #64748b; }
  `]
})
export class SettingsPageComponent {}
