import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../core/auth/auth.store';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import type { SignInRequest, SignUpRequest } from '../../domain';
import type { Observable } from 'rxjs';

/**
 * Public API surface for IAM operations consumed by presentation components.
 * Components should never import use-cases or infrastructure directly.
 */
@Injectable()
export class IamFacade {
  readonly authStore = inject(AuthStore);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly router = inject(Router);

  login(credentials: SignInRequest): Observable<void> {
    return this.loginUseCase.execute(credentials);
  }

  register(data: SignUpRequest): Observable<void> {
    return this.registerUseCase.execute(data);
  }

  logout(): void {
    this.authStore.clearSession();
    this.router.navigate(['/login']);
  }
}
