import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { IamApiService } from '../../infrastructure';
import type { SignUpRequest } from '../../domain';

@Injectable()
export class RegisterUseCase {
  private readonly api = inject(IamApiService);
  private readonly router = inject(Router);

  execute(data: SignUpRequest): Observable<void> {
    return this.api.signUp(data).pipe(
      tap(() => {
        this.router.navigate(['/login'], {
          queryParams: { registered: 'true' },
        });
      }),
      map(() => undefined),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
