import { Routes } from '@angular/router';
import { FamilyProfilePageComponent } from './pages/family-profile-page/family-profile-page.component';
import { PatientViewPageComponent } from './pages/patient-view-page/patient-view-page.component';
import { DoctorViewPageComponent } from './pages/doctor-view-page/doctor-view-page.component';
import { ProfilesFacade } from '../application';
import { CreateFamilyMemberUseCase } from '../application/use-cases/create-family-member.use-case';
import { GetFamilyMemberUseCase } from '../application/use-cases/get-family-member.use-case';
import { LinkFamilyToPatientUseCase } from '../application/use-cases/link-family-to-patient.use-case';
import { GetPatientUseCase } from '../application/use-cases/get-patient.use-case';
import { GetDoctorUseCase } from '../application/use-cases/get-doctor.use-case';
import { ProfilesApiService } from '../infrastructure';
import { roleGuard } from '../../../core/auth/role.guard';
import { UserRole } from '../domain/enums/user-role.enum';

const guard = roleGuard([UserRole.FAMILY_MEMBER]);

export const profilesRoutes: Routes = [
  {
    path: '',
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
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: FamilyProfilePageComponent, canActivate: [guard] },
      { path: 'patient', component: PatientViewPageComponent, canActivate: [guard] },
      { path: 'patient/:id', component: PatientViewPageComponent, canActivate: [guard] },
      { path: 'doctor', component: DoctorViewPageComponent, canActivate: [guard] },
      { path: 'doctor/:id', component: DoctorViewPageComponent, canActivate: [guard] },
    ],
  },
];
