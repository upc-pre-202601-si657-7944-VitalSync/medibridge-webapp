import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { IamApiService } from '../../infrastructure';
import { TokenStorageService } from '../../../../core/auth/token-storage.service';
import type { SignUpRequest } from '../../domain';

@Injectable()
export class RegisterUseCase {
  private readonly api = inject(IamApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  execute(data: SignUpRequest): Observable<void> {
    return this.api.signUp(data).pipe(
      tap(() => {
        this.tokenStorage.setRole(data.username, data.frontendRole);
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      }),
      map(() => undefined),
    );
  }
}
