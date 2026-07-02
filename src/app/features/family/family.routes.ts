import { Routes } from '@angular/router';
import { ProtectedLayoutComponent } from './presentation/layout/protected-layout.component';
import { DashboardPageComponent } from './presentation/pages/dashboard-page.component';
import { SettingsPageComponent } from './presentation/pages/settings-page.component';
import { FamilyProfilePageComponent } from '../profiles/presentation/pages/family-profile-page/family-profile-page.component';
import { PatientViewPageComponent } from '../profiles/presentation/pages/patient-view-page/patient-view-page.component';
import { DoctorViewPageComponent } from '../profiles/presentation/pages/doctor-view-page/doctor-view-page.component';
import { AppointmentsPageComponent } from '../appointments/presentation/pages/appointments-page.component';
import { MedicationPageComponent } from '../medication/presentation/pages/medication-page.component';
import { MonitoringPageComponent } from '../health-monitoring/presentation/pages/monitoring-page.component';
import { MessagesPageComponent } from '../communication/presentation/pages/messages-page.component';
import { ReportsPageComponent } from '../reports/presentation/pages/reports-page.component';
import { PaymentsPageComponent } from '../payments/presentation/pages/payments-page.component';
import { ProfilesFacade } from '../profiles/application';
import { CreateFamilyMemberUseCase } from '../profiles/application/use-cases/create-family-member.use-case';
import { GetFamilyMemberUseCase } from '../profiles/application/use-cases/get-family-member.use-case';
import { LinkFamilyToPatientUseCase } from '../profiles/application/use-cases/link-family-to-patient.use-case';
import { GetPatientUseCase } from '../profiles/application/use-cases/get-patient.use-case';
import { GetDoctorUseCase } from '../profiles/application/use-cases/get-doctor.use-case';
import { ProfilesApiService } from '../profiles/infrastructure';
import { AppointmentsApiService } from '../appointments/infrastructure/api/appointments-api.service';
import { MedicationApiService } from '../medication/infrastructure/api/medication-api.service';
import { HealthApiService } from '../health-monitoring/infrastructure/api/health-api.service';
import { CommunicationApiService } from '../communication/infrastructure/api/communication-api.service';
import { ReportsApiService } from '../reports/infrastructure/api/reports-api.service';
import { PaymentsApiService } from '../payments/infrastructure/api/payments-api.service';
import { roleGuard } from '../../core/auth/role.guard';
import { UserRole } from '../profiles/domain/enums/user-role.enum';

const guard = roleGuard([UserRole.FAMILY_MEMBER]);

export const familyRoutes: Routes = [
  {
    path: '',
    component: ProtectedLayoutComponent,
    providers: [
      ProfilesApiService,
      AppointmentsApiService,
      MedicationApiService,
      HealthApiService,
      CommunicationApiService,
      ReportsApiService,
      PaymentsApiService,
      CreateFamilyMemberUseCase,
      GetFamilyMemberUseCase,
      LinkFamilyToPatientUseCase,
      GetPatientUseCase,
      GetDoctorUseCase,
      ProfilesFacade,
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent, canActivate: [guard] },
      { path: 'profile', component: FamilyProfilePageComponent, canActivate: [guard] },
      { path: 'patient', component: PatientViewPageComponent, canActivate: [guard] },
      { path: 'patient/:id', component: PatientViewPageComponent, canActivate: [guard] },
      { path: 'doctor', component: DoctorViewPageComponent, canActivate: [guard] },
      { path: 'doctor/:id', component: DoctorViewPageComponent, canActivate: [guard] },
      { path: 'appointments', component: AppointmentsPageComponent, canActivate: [guard] },
      { path: 'medication', component: MedicationPageComponent, canActivate: [guard] },
      { path: 'monitoring', component: MonitoringPageComponent, canActivate: [guard] },
      { path: 'messages', component: MessagesPageComponent, canActivate: [guard] },
      { path: 'reports', component: ReportsPageComponent, canActivate: [guard] },
      { path: 'payments', component: PaymentsPageComponent, canActivate: [guard] },
      { path: 'settings', component: SettingsPageComponent, canActivate: [guard] },
    ],
  },
];
