# Medication Service — API Reference

**Service:** Medication Management  
**Base URL:** `https://medibridge-medication-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

### Medication Schedules

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/medication-schedules` | JWT | Create medication schedule |
| 2 | `GET` | `/medication-schedules/patients/{id}/active` | JWT | Get active schedules |

#### POST /medication-schedules
**Request:**
```json
{
  "medicationId": 1,
  "patientId": 1,
  "frequencyType": "TWICE_DAILY",
  "timesPerDay": 2,
  "administrationTime": "08:00",
  "startDate": "2026-07-01",
  "endDate": null
}
```
**FrequencyType enum:** `DAILY`, `TWICE_DAILY`, `WEEKLY`, `AS_NEEDED`  
**Response (201):** Same fields + `{ id, active: boolean }`

### Medications (Inventory)

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 3 | `POST` | `/medications` | JWT | Register medication |
| 4 | `GET` | `/medications/{id}` | JWT | Get medication by ID |
| 5 | `GET` | `/medications/patients/{id}` | JWT | List medications for patient |
| 6 | `PATCH` | `/medications/{id}/stock` | JWT | Update stock quantity |
| 7 | `GET` | `/medications/patients/{id}/low-stock` | JWT | Low stock alerts |

#### POST /medications
**Request:**
```json
{
  "patientId": 1,
  "name": "Ibuprofeno",
  "dosageAmount": 400,
  "dosageUnit": "MG",
  "administrationRoute": "ORAL",
  "stockQuantity": 30,
  "lowStockThreshold": 5,
  "expirationDate": "2027-06-01"
}
```
**DosageUnit enum:** `MG`, `ML`, `TABLET`, `CAPSULE`, `DROP`, `UNIT`  
**AdministrationRoute enum:** `ORAL`, `IV`, `IM`, `SUBCUTANEOUS`, `TOPICAL`  
**Response (201):** Same fields + `{ id, active: boolean }`

### Dose Administrations

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 8 | `POST` | `/dose-administrations` | JWT | Record dose taken |
| 9 | `POST` | `/dose-administrations/skip` | JWT | Record skipped dose |
| 10 | `GET` | `/dose-administrations/medications/{id}` | JWT | Dose history |

#### POST /dose-administrations
**Request:**
```json
{
  "medicationId": 1,
  "scheduleId": 1,
  "patientId": 1,
  "administeredAt": "2026-07-02T08:00:00",
  "notes": "Tomada con agua"
}
```
**Response (201):** Same fields + `{ id, status: "ADMINISTERED" }`

#### POST /dose-administrations/skip
**Request:**
```json
{
  "medicationId": 1,
  "scheduleId": 1,
  "patientId": 1,
  "skippedAt": "2026-07-02T08:00:00",
  "reason": "Paciente dormido"
}
```
**Response (201):** `DoseAdministrationResponse` with `status: "SKIPPED"`

### Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 11 | `GET` | `/internal/medications/patients/{id}/summary?startDate&endDate` | Internal | Medication summary |
