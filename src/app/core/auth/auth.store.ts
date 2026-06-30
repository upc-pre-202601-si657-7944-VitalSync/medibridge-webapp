import {
  Injectable,
  computed,
  signal,
  inject,
} from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import type { User } from '../../features/iam/domain';

/**
 * Singleton signals-based auth store.
 * Reads initial state from localStorage so the session survives a page reload.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenStorage = inject(TokenStorageService);

  // ---- state signals ----
  readonly accessToken = signal<string | null>(
    this.tokenStorage.getToken(),
  );

  readonly currentUser = signal<User | null>(
    this.#restoreUser(),
  );

  // ---- derived ----
  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  // ---- actions ----
  setSession(token: string, user: User): void {
    this.accessToken.set(token);
    this.currentUser.set(user);
    this.tokenStorage.setToken(token);
    this.tokenStorage.setUser(JSON.stringify(user));
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.tokenStorage.clear();
  }

  // ---- helpers ----
  #restoreUser(): User | null {
    const raw = this.tokenStorage.getUser();
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      this.tokenStorage.removeUser();
      return null;
    }
  }
}
