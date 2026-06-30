import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../core/config/environment';
import type { AuthResponse } from '../../domain/models/auth-response.model';
import type { SignInRequest } from '../../domain/models/sign-in-request.model';
import type { SignUpRequest } from '../../domain/models/sign-up-request.model';

/**
 * Thin HTTP adapter for the IAM authentication endpoints.
 * No business logic — only request/response transport.
 */
@Injectable()
export class IamApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  signIn(body: SignInRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.base}/authentication/sign-in`,
      body,
    );
  }

  signUp(body: SignUpRequest): Observable<void> {
    return this.http.post<void>(
      `${this.base}/authentication/sign-up`,
      body,
    );
  }
}
