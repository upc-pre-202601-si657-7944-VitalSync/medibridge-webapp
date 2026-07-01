import { Routes } from '@angular/router';
import { ProtectedLayoutComponent } from '../../../layout/protected-layout.component';
import { FamilyProfilePageComponent } from './pages/family-profile-page/family-profile-page.component';
import { PatientViewPageComponent } from './pages/patient-view-page/patient-view-page.component';
import { DoctorViewPageComponent } from './pages/doctor-view-page/doctor-view-page.component';
import { ProfilesFacade } from '../application';
import { CreateFamilyMemberUseCase } from '../application/use-cases/create-family-member.use-case';
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
      LinkFamilyToPatientUseCase,
      GetPatientUseCase,
      GetDoctorUseCase,
      ProfilesFacade,
    ],
    children: [
      { path: '', redirectTo: 'family-profile', pathMatch: 'full' },
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
    ],
  },
];
