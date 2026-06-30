import { inject } from '@angular/core';
import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthStore } from './auth.store';

/**
 * Intercepts outgoing HTTP requests and attaches the Bearer token
 * when a session is active.
 */
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authStore = inject(AuthStore);
  const token = authStore.accessToken();

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
}
