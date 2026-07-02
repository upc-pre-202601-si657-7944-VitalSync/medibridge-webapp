import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/iam/presentation/iam.routes').then(
        (m) => m.iamRoutes,
      ),
  },
  {
    path: 'family',
    loadChildren: () =>
      import('./features/profiles/presentation/profiles.routes').then(
        (m) => m.profilesRoutes,
      ),
  },
];
