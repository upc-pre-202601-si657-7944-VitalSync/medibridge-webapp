# Health Monitoring Service — API Reference

**Service:** Health Observations & Clinical Alerts  
**Base URL:** `https://medibridge-healthmonitoring-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/health-monitoring/patients/{id}/observations` | JWT | Record health observation |
| 2 | `GET` | `/health-monitoring/patients/{id}/observations` | JWT | Get observations |
| 3 | `GET` | `/health-monitoring/patients/{id}/alerts/active` | JWT + Premium | Active clinical alerts |
| 4 | `GET` | `/health-monitoring/patients/{id}/summary` | JWT + Premium | Health summary |
| 5 | `GET` | `/internal/health-monitoring/patients/{id}/summary?startDate&endDate` | Internal | Internal summary |

### POST /health-monitoring/patients/{id}/observations
**Request:**
```json
{
  "recordedByDoctorProfileId": null,
  "systolicBloodPressure": 120,
  "diastolicBloodPressure": 80,
  "bodyTemperature": 36.5,
  "painLevel": 2,
  "emotionalState": "CALM",
  "emotionalNotes": "Tranquilo",
  "clinicalNotes": "Sin novedades",
  "recordedAt": "2026-07-02T10:00:00"
}
```
**EmotionalState enum:** `CALM`, `ANXIOUS`, `SAD`, `IRRITABLE`, `CONFUSED`, `APATHETIC`  
**Response (201):** Same fields + `{ id }`

### GET /health-monitoring/patients/{id}/observations
**Response (200):** `PatientHealthObservationResource[]`

### GET /health-monitoring/patients/{id}/alerts/active
**Requires:** Premium subscription  
**Response (200):** `ClinicalAlertResource[]`
```json
{
  "id": 1,
  "patientId": 1,
  "observationId": 5,
  "severity": "HIGH",
  "status": "ACTIVE",
  "message": "Blood pressure elevated",
  "triggeredAt": "2026-07-02T10:00:00"
}
```
**AlertSeverity enum:** `MEDIUM`, `HIGH`  
**AlertStatus enum:** `ACTIVE`, `RESOLVED`
