# Appointments Service — API Reference

**Service:** Medical Appointments  
**Base URL:** `https://medibridge-appointments-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/appointments/medical` | JWT | Schedule medical appointment |
| 2 | `POST` | `/appointments/family-visits` | JWT | Schedule family visit |
| 3 | `GET` | `/appointments/{id}` | JWT | Get appointment by ID |
| 4 | `GET` | `/appointments/patient/{patientId}` | JWT | Get appointments by patient |
| 5 | `GET` | `/internal/appointments/patients/{id}/summary?startDate&endDate` | Internal | Get appointment summary |

### POST /appointments/medical
**Request:**
```json
{
  "patientId": 1,
  "doctorProfileId": 3,
  "startsAt": "2026-07-02T10:00:00",
  "durationInMinutes": 30,
  "reason": "Chequeo general"
}
```
**Response (201):**
```json
{
  "id": 1,
  "patientId": 1,
  "doctorProfileId": 3,
  "appointmentType": "MEDICAL",
  "status": "SCHEDULED",
  "startsAt": "2026-07-02T10:00:00",
  "endsAt": "2026-07-02T10:30:00",
  "reason": "Chequeo general"
}
```

### POST /appointments/family-visits
**Request:**
```json
{
  "patientId": 1,
  "familyMemberProfileId": 2,
  "startsAt": "2026-07-02T10:00:00",
  "durationInMinutes": 60,
  "reason": "Control mensual"
}
```
**Response (201):**
```json
{
  "id": 1,
  "patientId": 1,
  "familyMemberProfileId": 2,
  "appointmentType": "FAMILY_VISIT",
  "status": "SCHEDULED",
  "startsAt": "2026-07-02T10:00:00",
  "endsAt": "2026-07-02T11:00:00",
  "reason": "Control mensual"
}
```

### GET /appointments/patient/{patientId}
**Response (200):** `AppointmentResource[]` — same structure as above

### GET /appointments/{id}
**Response (200):** `AppointmentResource` — includes `doctorProfileId` (nullable) and `familyMemberProfileId` (nullable)
