import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://medibridge-healthmonitoring-service.onrender.com/api/v1/health-monitoring';

export interface HealthObservation {
  id: number;
  patientId: number;
  recordedByDoctorProfileId: number | null;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  bodyTemperature: number;
  painLevel: number;
  emotionalState: string;
  emotionalNotes: string;
  clinicalNotes: string;
  recordedAt: string;
}

export interface ClinicalAlert {
  id: number;
  patientId: number;
  observationId: number;
  severity: string;
  status: string;
  message: string;
  triggeredAt: string;
}

export interface RecordObservationPayload {
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  bodyTemperature: number;
  painLevel: number;
  emotionalState: string;
  emotionalNotes: string;
  clinicalNotes: string;
  recordedAt: string;
}

@Injectable()
export class HealthApiService {
  private readonly http = inject(HttpClient);

  getObservations(patientId: number): Observable<HealthObservation[]> {
    return this.http.get<HealthObservation[]>(`${BASE}/patients/${patientId}/observations`);
  }

  recordObservation(patientId: number, payload: RecordObservationPayload): Observable<HealthObservation> {
    return this.http.post<HealthObservation>(`${BASE}/patients/${patientId}/observations`, payload);
  }

  getActiveAlerts(patientId: number): Observable<ClinicalAlert[]> {
    return this.http.get<ClinicalAlert[]>(`${BASE}/patients/${patientId}/alerts/active`);
  }

  getSummary(patientId: number): Observable<{ patientId: number; summary: string }> {
    return this.http.get<{ patientId: number; summary: string }>(`${BASE}/patients/${patientId}/summary`);
  }
}
