import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://medibridge-medication-service.onrender.com/api/v1';

export interface Medication {
  id: number;
  patientId: number;
  name: string;
  dosageAmount: number;
  dosageUnit: string;
  administrationRoute: string;
  stockQuantity: number;
  lowStockThreshold: number;
  expirationDate: string;
  active: boolean;
}

export interface MedicationSchedule {
  id: number;
  medicationId: number;
  patientId: number;
  frequencyType: string;
  timesPerDay: number;
  administrationTime: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
}

export interface DoseRecord {
  id: number;
  medicationId: number;
  scheduleId: number;
  patientId: number;
  occurredAt: string;
  status: string;
  notes: string;
}

export interface LowStockAlert {
  medicationId: number;
  patientId: number;
  medicationName: string;
  currentStock: number;
  threshold: number;
}

@Injectable()
export class MedicationApiService {
  private readonly http = inject(HttpClient);

  getByPatient(patientId: number): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${BASE}/medications/patients/${patientId}`);
  }

  getById(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${BASE}/medications/${id}`);
  }

  create(payload: Partial<Medication>): Observable<Medication> {
    return this.http.post<Medication>(`${BASE}/medications`, payload);
  }

  updateStock(id: number, stockQuantity: number): Observable<Medication> {
    return this.http.patch<Medication>(`${BASE}/medications/${id}/stock`, { stockQuantity });
  }

  getLowStock(patientId: number): Observable<LowStockAlert[]> {
    return this.http.get<LowStockAlert[]>(`${BASE}/medications/patients/${patientId}/low-stock`);
  }

  getActiveSchedules(patientId: number): Observable<MedicationSchedule[]> {
    return this.http.get<MedicationSchedule[]>(`${BASE}/medication-schedules/patients/${patientId}/active`);
  }

  createSchedule(payload: Partial<MedicationSchedule>): Observable<MedicationSchedule> {
    return this.http.post<MedicationSchedule>(`${BASE}/medication-schedules`, payload);
  }

  recordDose(payload: { medicationId: number; scheduleId: number; patientId: number; administeredAt: string; notes: string }): Observable<DoseRecord> {
    return this.http.post<DoseRecord>(`${BASE}/dose-administrations`, payload);
  }

  skipDose(payload: { medicationId: number; scheduleId: number; patientId: number; skippedAt: string; reason: string }): Observable<DoseRecord> {
    return this.http.post<DoseRecord>(`${BASE}/dose-administrations/skip`, payload);
  }

  getDoseHistory(medicationId: number): Observable<DoseRecord[]> {
    return this.http.get<DoseRecord[]>(`${BASE}/dose-administrations/medications/${medicationId}`);
  }
}
