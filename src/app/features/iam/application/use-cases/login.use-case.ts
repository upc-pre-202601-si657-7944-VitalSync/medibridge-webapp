import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { IamApiService } from '../../infrastructure';
import { mapAuthResponseToUser } from '../../infrastructure';
import { AuthStore } from '../../../../core/auth/auth.store';
import type { SignInRequest } from '../../domain';

@Injectable()
export class LoginUseCase {
  private readonly api = inject(IamApiService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  execute(credentials: SignInRequest): Observable<void> {
    return this.api.signIn(credentials).pipe(
      tap((res) => {
        const user = mapAuthResponseToUser(res);
        this.authStore.setSession(res.token, user);
        this.router.navigate(['/home']);
      }),
      map(() => undefined),
    );
  }
}
