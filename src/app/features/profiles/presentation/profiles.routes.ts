import { Routes } from '@angular/router';
import { ProtectedLayoutComponent } from '../../../layout/protected-layout.component';
import { FamilyProfilePageComponent } from './pages/family-profile-page/family-profile-page.component';
import { PatientViewPageComponent } from './pages/patient-view-page/patient-view-page.component';
import { DoctorViewPageComponent } from './pages/doctor-view-page/doctor-view-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AppointmentsPageComponent } from './pages/appointments-page/appointments-page.component';
import { MedicationPageComponent } from './pages/medication-page/medication-page.component';
import { MonitoringPageComponent } from './pages/monitoring-page/monitoring-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { PaymentsPageComponent } from './pages/payments-page/payments-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { ProfilesFacade } from '../application';
import { CreateFamilyMemberUseCase } from '../application/use-cases/create-family-member.use-case';
import { GetFamilyMemberUseCase } from '../application/use-cases/get-family-member.use-case';
import { LinkFamilyToPatientUseCase } from '../application/use-cases/link-family-to-patient.use-case';
import { GetPatientUseCase } from '../application/use-cases/get-patient.use-case';
import { GetDoctorUseCase } from '../application/use-cases/get-doctor.use-case';
import { ProfilesApiService } from '../infrastructure';
import { AppointmentsApiService } from '../infrastructure/api/appointments/appointments-api.service';
import { MedicationApiService } from '../infrastructure/api/medication/medication-api.service';
import { HealthApiService } from '../infrastructure/api/health/health-api.service';
import { CommunicationApiService } from '../infrastructure/api/communication/communication-api.service';
import { ReportsApiService } from '../infrastructure/api/reports/reports-api.service';
import { PaymentsApiService } from '../infrastructure/api/payments/payments-api.service';
import { roleGuard } from '../../../core/auth/role.guard';
import { UserRole } from '../domain/enums/user-role.enum';

const guard = roleGuard([UserRole.FAMILY_MEMBER]);

export const profilesRoutes: Routes = [
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
