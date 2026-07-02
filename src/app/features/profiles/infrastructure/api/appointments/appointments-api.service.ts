import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id: number;
  patientId: number;
  doctorProfileId: number | null;
  familyMemberProfileId: number | null;
  appointmentType: string;
  status: string;
  startsAt: string;
  endsAt: string;
  reason: string;
}

export interface ScheduleFamilyVisitPayload {
  patientId: number;
  familyMemberProfileId: number;
  startsAt: string;
  durationInMinutes: number;
  reason: string;
}

@Injectable()
export class AppointmentsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://medibridge-appointments-service.onrender.com/api/v1/appointments';

  getByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/patient/${patientId}`);
  }

  getById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.base}/${id}`);
  }

  scheduleFamilyVisit(payload: ScheduleFamilyVisitPayload): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.base}/family-visits`, payload);
  }
}
