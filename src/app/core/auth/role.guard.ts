import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';
import { UserRole } from '../../features/profiles/domain/enums/user-role.enum';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const currentUser = authStore.currentUser();

    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    // If the user does not have the required role, redirect to login or a forbidden page
    router.navigate(['/login']);
    return false;
  };
};
