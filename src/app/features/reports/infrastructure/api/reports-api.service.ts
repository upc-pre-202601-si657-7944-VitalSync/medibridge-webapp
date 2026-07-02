import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://medibridge-reports-analytics-service.onrender.com/api/v1';

export interface ClinicalReport {
  id: number;
  patientId: number;
  reportType: string;
  periodStartDate: string;
  periodEndDate: string;
  generatedAt: string;
  summary: string;
  pdfPath: string | null;
}

export interface GenerateReportPayload {
  patientId: number;
  reportType: string;
  startDate: string;
  endDate: string;
}

export interface DashboardMetrics {
  id: number;
  patientId: number;
  metricSnapshots: { id: number; metricType: string; value: number; unit: string; capturedAt: string }[];
  trendIndicators: { id: number; metricType: string; direction: string; explanation: string }[];
}

@Injectable()
export class ReportsApiService {
  private readonly http = inject(HttpClient);

  generateReport(payload: GenerateReportPayload): Observable<ClinicalReport> {
    return this.http.post<ClinicalReport>(`${BASE}/clinical-reports`, payload);
  }

  getReportsByPatient(patientId: number): Observable<ClinicalReport[]> {
    return this.http.get<ClinicalReport[]>(`${BASE}/clinical-reports/patients/${patientId}`);
  }

  getReportById(id: number): Observable<ClinicalReport> {
    return this.http.get<ClinicalReport>(`${BASE}/clinical-reports/${id}`);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${BASE}/clinical-reports/${id}/pdf`, { responseType: 'blob' });
  }

  getDashboard(patientId: number): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${BASE}/analytics-dashboards/patients/${patientId}`);
  }
}
