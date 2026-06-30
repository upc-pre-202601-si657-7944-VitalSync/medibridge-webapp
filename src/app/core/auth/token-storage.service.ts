import { Injectable } from '@angular/core';

const TOKEN_KEY = 'mb_access_token';
const USER_KEY = 'mb_user';

/**
 * Stores and retrieves the JWT token and serialized user object
 * from localStorage.
 *
 * Trade-off: localStorage is vulnerable to XSS. For a production app
 * with stricter security requirements, prefer an httpOnly cookie
 * managed by the backend, or use a service worker with the
 * Credential Management API. localStorage is acceptable here as
 * the backend is already a known local service during early development.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getUser(): string | null {
    return localStorage.getItem(USER_KEY);
  }

  setUser(userJson: string): void {
    localStorage.setItem(USER_KEY, userJson);
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
