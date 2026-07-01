import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FamilySidebarComponent } from './sidebar/family-sidebar.component';

@Component({
  selector: 'app-protected-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FamilySidebarComponent],
  template: `
    <div class="layout">
      <app-family-sidebar></app-family-sidebar>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      background: #f8fafc;
    }
  `]
})
export class ProtectedLayoutComponent {}
