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
      import('./features/family/family.routes').then(
        (m) => m.familyRoutes,
      ),
  },
];
