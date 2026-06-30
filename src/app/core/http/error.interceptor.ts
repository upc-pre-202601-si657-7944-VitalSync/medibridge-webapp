import { inject } from '@angular/core';
import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth.store';

/**
 * Centralised HTTP error handler.
 * - 401 → clears session and does NOT redirect (caller handles navigation).
 * - Others → re-throws for per-feature handling.
 */
export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        authStore.clearSession();
      }
      return throwError(() => err);
    }),
  );
}
