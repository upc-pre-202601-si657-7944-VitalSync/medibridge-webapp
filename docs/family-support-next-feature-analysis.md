# Family Support Network — Next Feature Analysis

**Project:** MediBridge Web Application (Frontend)  
**Segment:** Family Support Network  
**Status:** Validated recommendation  
**Date:** 2026-07-01

---

## 1. Purpose

This document records the technical analysis used to select the **next bounded context** to implement after `Profiles` for the **Family Support Network** segment.

The goal is to move in a sequence that is:

- aligned with the real backend contracts
- functionally useful for family users
- implementable without inventing missing backend behavior

---

## 2. Current Situation After Profiles

The `Profiles` feature is now in a usable state for **Family Support Network**.

### What is already available

- Family member profile creation
- Protected layout and sidebar for the segment
- Role-based route protection
- Local context persistence for:
  - `familyMemberProfileId`
  - `linkedPatientId`
- Manual patient linking workflow (workaround B)
- Patient detail view using the linked `patientId`

### Known backend limitation

The backend still does **not** expose a public endpoint that resolves the family context automatically from the authenticated user.

Missing public capabilities:

- resolve `familyMemberProfileId` from authenticated `userId`
- resolve linked `patientId` from authenticated family member
- resolve treating `doctorProfileId` from authenticated family member

Because of this, the frontend currently relies on a **manual patient linking workaround**.

---

## 3. Backend Validation Per Related Context

The backend code was reviewed directly to determine which bounded context can be implemented next with the **least friction** and the **highest functional value**.

### 3.1 Profiles

Profiles confirms that access validation exists, but automatic family context resolution does not.

Confirmed internal capabilities:

- `GET /api/v1/internal/profiles/users/{userId}/can-access/{patientId}`
- `GET /api/v1/internal/profiles/patients/{patientId}/care-team-members`

These endpoints validate access **if the frontend already knows `patientId`**.

### 3.2 Appointments

Appointments was reviewed directly in code and exposes public endpoints that fit the family workflow.

Confirmed public endpoints:

- `POST /api/v1/appointments/family-visits`
- `POST /api/v1/appointments/medical`
- `GET /api/v1/appointments/{appointmentId}`
- `GET /api/v1/appointments/patient/{patientId}`

Important implementation detail:

Appointments resolves the authenticated `userId` from JWT and validates access through Profiles using `userId + patientId`.

This means:

- Appointments does **not** need to derive patient context automatically
- It only requires a valid `patientId`
- The current Profiles workaround already provides that requirement

### 3.3 Health Monitoring

Health Monitoring also follows the same access model:

- resolve authenticated `userId`
- receive `patientId`
- validate access against Profiles

Confirmed public endpoints include:

- `POST /api/v1/health-monitoring/patients/{patientId}/observations`
- `GET /api/v1/health-monitoring/patients/{patientId}/observations`
- `GET /api/v1/health-monitoring/patients/{patientId}/alerts/active`
- `GET /api/v1/health-monitoring/patients/{patientId}/summary`

However, this context is more clinically sensitive and less appropriate as the immediate next step for family users than Appointments.

### 3.4 Communication

Communication has multiple controllers (`ChatController`, `ConnectedUserController`, `NotificationController`) and is a strong candidate later, but it is not as foundational as Appointments for the immediate family workflow.

### 3.5 Payments

Payments is relevant for account administration, but it does not unlock the core care journey in the same way Profiles and Appointments do.

---

## 4. Recommendation

### Recommended next bounded context

## `Appointments`

This is the recommended next feature for **Family Support Network**.

### Why Appointments is the best next step

1. **It is compatible with the current Profiles workaround**

Appointments only needs:

- authenticated `userId`
- known `patientId`

Both are already available in the current frontend flow.

2. **It has direct value for family users**

Family users need to:

- view patient appointments
- understand upcoming visits
- schedule family visits

3. **Its access model is already validated by backend code**

The service already protects operations through `userId + patientId` access validation.

4. **It avoids inventing unsupported behavior**

No extra backend endpoints are required to begin Appointments, unlike a more complete Doctor or broader family context flow.

---

## 5. Recommended Implementation Order For Family Support Network

1. `Profiles` ✅
2. `Appointments`
3. `Health Monitoring`
4. `Communication`
5. `Medication`
6. `Reports & Analytics`
7. `Payments`

This order prioritizes:

- existing backend support
- family-user value
- clean dependency progression

---

## 6. Implementation Consequence

The frontend can now move to `Appointments` without waiting for new backend endpoints.

### Required input for Appointments

- `patientId` from the local Profiles context

### No additional backend dependency required first

Appointments is the first post-Profiles BC that can be implemented with the current contracts and workaround already in place.

---

## 7. Decision Summary

**Decision:** The next feature to implement for **Family Support Network** is **Appointments**.  
**Reason:** It is the strongest combination of backend readiness, family-user relevance, and compatibility with the current Profiles context workaround.
