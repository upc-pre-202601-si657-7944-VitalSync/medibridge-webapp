import type { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard, guestGuard } from '../../../core/auth/auth.guard';
import { IamApiService } from '../infrastructure/api/iam-api.service';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { IamFacade } from '../application/facades/iam.facade';

/**
 * Lazy-loaded IAM feature routes.
 * Providers are scoped to this route tree.
 */
export const iamRoutes: Routes = [
  {
    path: '',
    providers: [IamApiService, LoginUseCase, RegisterUseCase, IamFacade],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [guestGuard()],
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [guestGuard()],
      },
      {
        path: 'home',
        component: HomePageComponent,
        canActivate: [authGuard()],
      },
    ],
  },
];
