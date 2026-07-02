# MediBridge API — Endpoints by Segment

> Generated from microservice controllers on 2026-07-02.
> Production base URLs per service in [Feature-microservice.md](../Feature-microservice.md).

---

## Family Support Network

**Role:** Family member linked to a patient.  
**JWT role:** `ROLE_ADMIN` → frontend `FAMILY_MEMBER`.

### Profiles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/profiles/family-members` | JWT | Create family profile. Body: `{fullName}` → `{id, userId, fullName}` |
| `GET` | `/api/v1/profiles/family-members/{id}` | JWT | Get family profile by ID → `{id, userId, fullName}` |
| `POST` | `/api/v1/profiles/patients/{pid}/family-members/{fid}` | JWT | Link family to patient. Body: `{}` → `{id, familyMemberProfileId, patientId, active}` |
| `GET` | `/api/v1/profiles/patients/{id}` | JWT | Get patient info → `{id, fullName}` |
| `GET` | `/api/v1/profiles/doctors/{id}` | JWT | Get doctor info → `{id, userId, fullName}` |

### Appointments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/appointments/family-visits` | JWT | Schedule family visit. Body: `{patientId, familyMemberProfileId, startsAt, durationInMinutes, reason}` |
| `GET` | `/api/v1/appointments/{id}` | JWT | Get appointment by ID → `{id, patientId, doctorProfileId, familyMemberProfileId, appointmentType, status, startsAt, endsAt, reason}` |
| `GET` | `/api/v1/appointments/patient/{patientId}` | JWT | List appointments for patient |

### Medication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/medication-schedules` | JWT | Create schedule. Body: `{medicationId, patientId, frequencyType, timesPerDay, administrationTime, startDate, endDate}` |
| `GET` | `/api/v1/medication-schedules/patients/{id}/active` | JWT | Get active schedules for patient |
| `POST` | `/api/v1/medications` | JWT | Register medication. Body: `{patientId, name, dosageAmount, dosageUnit, administrationRoute, stockQuantity, lowStockThreshold, expirationDate}` |
| `GET` | `/api/v1/medications/{id}` | JWT | Get medication by ID |
| `GET` | `/api/v1/medications/patients/{id}` | JWT | List medications for patient |
| `PATCH` | `/api/v1/medications/{id}/stock` | JWT | Update stock. Body: `{stockQuantity}` |
| `GET` | `/api/v1/medications/patients/{id}/low-stock` | JWT | Low stock alerts |
| `POST` | `/api/v1/dose-administrations` | JWT | Record dose taken. Body: `{medicationId, scheduleId, patientId, administeredAt, notes}` |
| `POST` | `/api/v1/dose-administrations/skip` | JWT | Record skipped dose. Body: `{medicationId, scheduleId, patientId, skippedAt, reason}` |
| `GET` | `/api/v1/dose-administrations/medications/{id}` | JWT | Dose history for medication |

### Health Monitoring

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/health-monitoring/patients/{id}/observations` | JWT | Record observation. Body: `{systolicBloodPressure, diastolicBloodPressure, bodyTemperature, painLevel, emotionalState, emotionalNotes, clinicalNotes, recordedAt}` |
| `GET` | `/api/v1/health-monitoring/patients/{id}/observations` | JWT | Get observations for patient |
| `GET` | `/api/v1/health-monitoring/patients/{id}/alerts/active` | JWT+Premium | Active clinical alerts → `[{id, severity, status, message}]` |
| `GET` | `/api/v1/health-monitoring/patients/{id}/summary` | JWT+Premium | Health summary text |

### Communication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/chat/messages` | JWT | Send message. Body: `{recipientUserId, content, sentAt}` |
| `GET` | `/api/v1/chat/messages/{sender}/{recipient}` | JWT | Get conversation (caller must be participant) |
| `POST` | `/api/v1/chat/users/connect` | JWT | Go online. Body: `{userId, username, fullName}` |
| `POST` | `/api/v1/chat/users/disconnect` | JWT | Go offline. Body: `{userId}` |
| `GET` | `/api/v1/chat/users/connected` | JWT | List online users |
| `GET` | `/api/v1/notifications/recipients/{userId}` | JWT | Get all notifications |
| `GET` | `/api/v1/notifications/recipients/{userId}/unread` | JWT | Get unread notifications |
| `PATCH` | `/api/v1/notifications/{id}/read` | JWT | Mark notification as read |

### Reports & Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/clinical-reports` | JWT+Premium | Generate report. Body: `{patientId, reportType, startDate, endDate}` |
| `POST` | `/api/v1/clinical-reports/{id}/pdf` | JWT+Premium | Generate PDF |
| `GET` | `/api/v1/clinical-reports/{id}/pdf` | JWT+Premium | Download PDF |
| `GET` | `/api/v1/clinical-reports/{id}` | JWT+Premium | Get report by ID |
| `GET` | `/api/v1/clinical-reports/patients/{patientId}` | JWT+Premium | List reports for patient |
| `GET` | `/api/v1/analytics-dashboards/patients/{patientId}` | JWT+Premium | Dashboard metrics → `{metricSnapshots, trendIndicators}` |

### Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/subscriptions` | JWT | Create subscription. Body: `{userId, commercialLine: "FAMILY", planType, billingCycle}` |
| `POST` | `/api/v1/subscriptions/{id}/cancel` | JWT | Cancel subscription |
| `GET` | `/api/v1/subscriptions/users/{userId}/active` | JWT | Get active subscription → `{plan: {maxPatients}, status}` |
| `GET` | `/api/v1/invoices/users/{userId}` | JWT | Get invoices |
| `POST` | `/api/v1/subscriptions/payment-methods` | JWT | Add payment method. Body: `{userId, brand, lastFourDigits, stripePaymentMethodId}` |

---

## Care Staff

**Role:** Doctor / Caregiver managing patients.  
**JWT role:** `ROLE_USER` → frontend `CAREGIVER`.

### Profiles

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/profiles/doctors` | JWT | Create doctor profile. Body: `{fullName}` → `{id, userId, fullName}` |
| `GET` | `/api/v1/profiles/doctors/{id}` | JWT | Get doctor profile by ID |
| `POST` | `/api/v1/profiles/patients/{pid}/doctors/{did}` | JWT | Assign doctor to patient. Body: `{}`. Requires INSTITUTION subscription |
| `GET` | `/api/v1/profiles/patients/{id}` | JWT | Get patient info |
| `GET` | `/api/v1/profiles/family-members/{id}` | JWT | Get family member info |

### Appointments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/appointments/medical` | JWT | Schedule medical appointment. Body: `{patientId, doctorProfileId, startsAt, durationInMinutes, reason}` |
| `GET` | `/api/v1/appointments/{id}` | JWT | Get appointment by ID |
| `GET` | `/api/v1/appointments/patient/{patientId}` | JWT | List appointments for patient |

### Medication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/medication-schedules` | JWT | Create schedule |
| `GET` | `/api/v1/medication-schedules/patients/{id}/active` | JWT | Active schedules for patient |
| `POST` | `/api/v1/medications` | JWT | Register medication |
| `GET` | `/api/v1/medications/{id}` | JWT | Get medication |
| `GET` | `/api/v1/medications/patients/{id}` | JWT | Patient medications |
| `PATCH` | `/api/v1/medications/{id}/stock` | JWT | Update stock |
| `GET` | `/api/v1/medications/patients/{id}/low-stock` | JWT | Low stock alerts |
| `POST` | `/api/v1/dose-administrations` | JWT | Record dose |
| `POST` | `/api/v1/dose-administrations/skip` | JWT | Skip dose |
| `GET` | `/api/v1/dose-administrations/medications/{id}` | JWT | Dose history |

### Health Monitoring

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/health-monitoring/patients/{id}/observations` | JWT | Record observation (includes `recordedByDoctorProfileId`) |
| `GET` | `/api/v1/health-monitoring/patients/{id}/observations` | JWT | Get observations |
| `GET` | `/api/v1/health-monitoring/patients/{id}/alerts/active` | JWT+Premium | Active alerts |
| `GET` | `/api/v1/health-monitoring/patients/{id}/summary` | JWT+Premium | Health summary |

### Communication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/chat/messages` | JWT | Send message |
| `GET` | `/api/v1/chat/messages/{sender}/{recipient}` | JWT | Get conversation |
| `POST` | `/api/v1/chat/users/connect` | JWT | Go online |
| `POST` | `/api/v1/chat/users/disconnect` | JWT | Go offline |
| `GET` | `/api/v1/chat/users/connected` | JWT | Online users |
| `GET` | `/api/v1/notifications/recipients/{userId}` | JWT | All notifications |
| `GET` | `/api/v1/notifications/recipients/{userId}/unread` | JWT | Unread notifications |
| `PATCH` | `/api/v1/notifications/{id}/read` | JWT | Mark read |

### Reports & Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/clinical-reports` | JWT+Premium | Generate report |
| `POST` | `/api/v1/clinical-reports/{id}/pdf` | JWT+Premium | Generate PDF |
| `GET` | `/api/v1/clinical-reports/{id}/pdf` | JWT+Premium | Download PDF |
| `GET` | `/api/v1/clinical-reports/{id}` | JWT+Premium | Get report |
| `GET` | `/api/v1/clinical-reports/patients/{patientId}` | JWT+Premium | Patient reports |
| `GET` | `/api/v1/analytics-dashboards/patients/{patientId}` | JWT+Premium | Dashboard metrics |

### Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/subscriptions` | JWT | Create subscription. Body: `{userId, commercialLine: "INSTITUTION", planType, billingCycle}` |
| `POST` | `/api/v1/subscriptions/{id}/cancel` | JWT | Cancel subscription |
| `GET` | `/api/v1/subscriptions/users/{userId}/active` | JWT | Active subscription |
| `GET` | `/api/v1/invoices/users/{userId}` | JWT | Get invoices |
| `POST` | `/api/v1/subscriptions/payment-methods` | JWT | Add payment method |

---

## Service Base URLs

| Service | Base URL |
|---------|----------|
| IAM | `https://medibridge-iam-service.onrender.com/api/v1` |
| Profiles | `https://medibridge-profiles-service.onrender.com/api/v1` |
| Appointments | `https://medibridge-appointments-service.onrender.com/api/v1` |
| Medication | `https://medibridge-medication-service.onrender.com/api/v1` |
| Health Monitoring | `https://medibridge-healthmonitoring-service.onrender.com/api/v1` |
| Communication | `https://medibridge-communication-service.onrender.com/api/v1` |
| Payments | `https://medibridge-payments-service.onrender.com/api/v1` |
| Reports & Analytics | `https://medibridge-reports-analytics-service.onrender.com/api/v1` |

## Enums Reference

### CommercialLine
`FAMILY` | `INSTITUTION`

### PlanType
`FREE` | `FAMILY_PREMIUM` | `INSTITUTION_BASIC` | `INSTITUTION_PREMIUM`

### ReportType
`VITAL_SIGNS` | `MEDICATION` | `FULL_CLINICAL`

### FrequencyType
`DAILY` | `TWICE_DAILY` | `WEEKLY` | `AS_NEEDED`

### DosageUnit
`MG` | `ML` | `TABLET` | `CAPSULE` | `DROP` | `UNIT`

### AdministrationRoute
`ORAL` | `IV` | `IM` | `SUBCUTANEOUS` | `TOPICAL`

### EmotionalState
`CALM` | `ANXIOUS` | `SAD` | `IRRITABLE` | `CONFUSED` | `APATHETIC`

### NotificationType
`CRITICAL_ALERT` | `DOSE_ADMINISTERED` | `DOSE_SKIPPED` | `STOCK_LOW` | `SYSTEM`
