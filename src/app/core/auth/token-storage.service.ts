import { Injectable } from '@angular/core';

const TOKEN_KEY = 'mb_access_token';
const USER_KEY = 'mb_user';
const ROLE_KEY = 'mb_user_roles';

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

  getRole(username: string): string | null {
    const map = this.#readRoleMap();
    return map[username] ?? null;
  }

  setRole(username: string, role: string): void {
    const map = this.#readRoleMap();
    map[username] = role;
    localStorage.setItem(ROLE_KEY, JSON.stringify(map));
  }

  #readRoleMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(ROLE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }
}
