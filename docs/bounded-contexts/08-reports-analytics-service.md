# Reports & Analytics Service — API Reference

**Service:** Clinical Reports & Analytics Dashboards  
**Base URL:** `https://medibridge-reports-analytics-service.onrender.com/api/v1`  
**Version:** 2026-07-02

**Auth:** All endpoints require JWT + paid subscription (Premium)

## Endpoints

### Clinical Reports

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/clinical-reports` | JWT + Premium | Generate clinical report |
| 2 | `POST` | `/clinical-reports/{id}/pdf` | JWT + Premium | Generate PDF for report |
| 3 | `GET` | `/clinical-reports/{id}/pdf` | JWT + Premium | Download PDF (binary) |
| 4 | `GET` | `/clinical-reports/{id}` | JWT + Premium | Get report by ID |
| 5 | `GET` | `/clinical-reports/patients/{patientId}` | JWT + Premium | Get reports for patient |

### Analytics Dashboard

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 6 | `GET` | `/analytics-dashboards/patients/{patientId}` | JWT + Premium | Dashboard metrics |

### POST /clinical-reports
**Request:**
```json
{
  "patientId": 1,
  "reportType": "FULL_CLINICAL",
  "startDate": "2026-06-01",
  "endDate": "2026-07-01"
}
```
**ReportType enum:** `VITAL_SIGNS`, `MEDICATION`, `FULL_CLINICAL`

**Response (201):**
```json
{
  "id": 1,
  "patientId": 1,
  "reportType": "FULL_CLINICAL",
  "periodStartDate": "2026-06-01",
  "periodEndDate": "2026-07-01",
  "generatedAt": "2026-07-02T10:00:00",
  "summary": "Report summary text...",
  "pdfPath": null,
  "sections": [
    {
      "id": 1,
      "title": "Vital Signs",
      "content": "...",
      "displayOrder": 1
    }
  ]
}
```

### GET /analytics-dashboards/patients/{patientId}
**Response (200):**
```json
{
  "id": 1,
  "patientId": 1,
  "metricSnapshots": [
    {
      "id": 1,
      "metricType": "MEDICATION_ADHERENCE",
      "value": 85.5,
      "unit": "%",
      "capturedAt": "2026-07-02T10:00:00"
    }
  ],
  "trendIndicators": [
    {
      "id": 1,
      "metricType": "VITAL_SIGN_RECORDS",
      "direction": "IMPROVING",
      "explanation": "Blood pressure trending down over past 2 weeks"
    }
  ]
}
```
**MetricType enum:** `VITAL_SIGN_RECORDS`, `MEDICATION_ADHERENCE`, `APPOINTMENT_COMPLETION`, `CLINICAL_ALERTS`  
**TrendDirection enum:** `IMPROVING`, `STABLE`, `DECLINING`
