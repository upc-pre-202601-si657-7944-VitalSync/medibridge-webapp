import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from './auth.store';

/**
 * Route guard: allows activation only when the user is authenticated.
 * Unauthenticated visitors are redirected to /login.
 */
export function authGuard(): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isAuthenticated()) {
      return true;
    }
    return router.createUrlTree(['/login']);
  };
}

/**
 * Route guard: allows activation only when the user is NOT authenticated.
 * Already-authenticated users are redirected to /home.
 */
export function guestGuard(): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return true;
    }
    return router.createUrlTree(['/family/dashboard']);
  };
}
