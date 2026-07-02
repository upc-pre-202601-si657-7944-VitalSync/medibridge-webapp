import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { FamilyMember, Patient, Doctor } from '../../domain';

export interface CreateFamilyMemberPayload {
  fullName: string;
}

@Injectable()
export class ProfilesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://medibridge-profiles-service.onrender.com/api/v1/profiles';

  createFamilyMember(payload: CreateFamilyMemberPayload): Observable<FamilyMember> {
    return this.http.post<FamilyMember>(`${this.baseUrl}/family-members`, payload);
  }

  getFamilyMemberById(id: number): Observable<FamilyMember> {
    return this.http.get<FamilyMember>(`${this.baseUrl}/family-members/${id}`);
  }

  linkFamilyToPatient(patientId: number, familyMemberId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/patients/${patientId}/family-members/${familyMemberId}`,
      {}
    );
  }

  getPatientById(patientId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${patientId}`);
  }

  getDoctorById(doctorId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/doctors/${doctorId}`);
  }
}
