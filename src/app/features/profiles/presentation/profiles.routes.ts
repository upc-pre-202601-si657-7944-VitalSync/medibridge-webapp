import { Routes } from '@angular/router';
import { ProtectedLayoutComponent } from '../../../layout/protected-layout.component';
import { FamilyProfilePageComponent } from './pages/family-profile-page/family-profile-page.component';
import { PatientViewPageComponent } from './pages/patient-view-page/patient-view-page.component';
import { DoctorViewPageComponent } from './pages/doctor-view-page/doctor-view-page.component';
import { PlaceholderPageComponent } from './pages/placeholder-page/placeholder-page.component';
import { ProfilesFacade } from '../application';
import { CreateFamilyMemberUseCase } from '../application/use-cases/create-family-member.use-case';
import { GetFamilyMemberUseCase } from '../application/use-cases/get-family-member.use-case';
import { LinkFamilyToPatientUseCase } from '../application/use-cases/link-family-to-patient.use-case';
import { GetPatientUseCase } from '../application/use-cases/get-patient.use-case';
import { GetDoctorUseCase } from '../application/use-cases/get-doctor.use-case';
import { ProfilesApiService } from '../infrastructure';
import { roleGuard } from '../../../core/auth/role.guard';
import { UserRole } from '../domain/enums/user-role.enum';

export const profilesRoutes: Routes = [
  {
    path: '',
    component: ProtectedLayoutComponent,
    providers: [
      ProfilesApiService,
      CreateFamilyMemberUseCase,
      GetFamilyMemberUseCase,
      LinkFamilyToPatientUseCase,
      GetPatientUseCase,
      GetDoctorUseCase,
      ProfilesFacade,
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'dashboard' as const, titleKey: 'profiles.sidebar.dashboard', descKey: 'profiles.sidebar.dashboard' },
      },
      {
        path: 'family-profile',
        component: FamilyProfilePageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
      },
      {
        path: 'patient',
        component: PatientViewPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
      },
      {
        path: 'patient/:id',
        component: PatientViewPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
      },
      {
        path: 'doctor',
        component: DoctorViewPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
      },
      {
        path: 'doctor/:id',
        component: DoctorViewPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
      },
      {
        path: 'appointments',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'calendar' as const, titleKey: 'profiles.sidebar.appointments', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'medication',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'pill' as const, titleKey: 'profiles.sidebar.medication', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'monitoring',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'activity' as const, titleKey: 'profiles.sidebar.monitoring', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'messages',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'message-circle' as const, titleKey: 'profiles.sidebar.messages', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'reports',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'file-text' as const, titleKey: 'profiles.sidebar.reports', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'payments',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'credit-card' as const, titleKey: 'profiles.sidebar.payments', descKey: 'profiles.placeholder.comingSoon' },
      },
      {
        path: 'settings',
        component: PlaceholderPageComponent,
        canActivate: [roleGuard([UserRole.FAMILY_MEMBER])],
        data: { icon: 'settings' as const, titleKey: 'profiles.sidebar.settings', descKey: 'profiles.placeholder.comingSoon' },
      },
    ],
  },
];
