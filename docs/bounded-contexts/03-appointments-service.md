# Appointments Service — API Reference

**Base URL:** `https://medibridge-appointments-service.onrender.com/api/v1`  
**Version:** 2026-07-02

---

## Family Support Network

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/appointments/family-visits` | JWT | Agendar visita familiar |
| 2 | `GET` | `/appointments/patient/{patientId}` | JWT | Ver todas las citas del paciente |
| 3 | `GET` | `/appointments/{id}` | JWT | Ver detalle de una cita |

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

---

## Care Staff

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/appointments/medical` | JWT | Agendar cita médica |
| 2 | `GET` | `/appointments/patient/{patientId}` | JWT | Ver todas las citas del paciente |
| 3 | `GET` | `/appointments/{id}` | JWT | Ver detalle de una cita |

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

---

## Common (ambos segmentos)

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| — | `GET` | `/appointments/patient/{patientId}` | JWT | Lista todas las citas (ambos tipos) |
| — | `GET` | `/appointments/{id}` | JWT | Una cita específica → incluye `doctorProfileId` y `familyMemberProfileId` (nullable) |

---

## Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| — | `GET` | `/internal/appointments/patients/{id}/summary?startDate&endDate` | Internal | Resumen de citas (query params opcionales) |
