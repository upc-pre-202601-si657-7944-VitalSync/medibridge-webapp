# Profiles Service — API Reference

**Service:** Profiles & Care Relationships  
**Base URL:** `https://medibridge-profiles-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

### Patient Profiles

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/profiles/patients` | JWT | Create patient profile |
| 2 | `GET` | `/profiles/patients/{id}` | JWT | Get patient by ID |

#### POST /profiles/patients
**Request:** `{ fullName: string }`  
**Response (201):** `{ id: number, fullName: string }`

#### GET /profiles/patients/{id}
**Response (200):** `{ id: number, fullName: string }`

### Family Member Profiles

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 3 | `POST` | `/profiles/family-members` | JWT | Create family member profile |
| 4 | `GET` | `/profiles/family-members/{id}` | JWT | Get family member by ID |

#### POST /profiles/family-members
**Request:** `{ fullName: string }`  
**Auth:** Extracts `userId` from JWT `sub` → IAM `by-username`  
**Response (201):** `{ id: number, userId: number, fullName: string }`

#### GET /profiles/family-members/{id}
**Response (200):** `{ id: number, userId: number, fullName: string }`

### Doctor Profiles

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 5 | `POST` | `/profiles/doctors` | JWT | Create doctor profile |
| 6 | `GET` | `/profiles/doctors/{id}` | JWT | Get doctor by ID |

#### POST /profiles/doctors
**Request:** `{ fullName: string }`  
**Auth:** Extracts `userId` from JWT `sub` → IAM `by-username`  
**Response (201):** `{ id: number, userId: number, fullName: string }`

#### GET /profiles/doctors/{id}
**Response (200):** `{ id: number, userId: number, fullName: string }`

### Care Relationships

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 7 | `POST` | `/profiles/patients/{pid}/doctors/{did}` | JWT | Assign doctor to patient |
| 8 | `POST` | `/profiles/patients/{pid}/family-members/{fid}` | JWT | Link family member to patient |

#### POST /profiles/patients/{pid}/doctors/{did}
**Request:** `{}`  
**Auth:** Ownership check — doctor profile `userId` must match JWT user. Requires INSTITUTION subscription.  
**Response (201):** `{ id: number, doctorProfileId: number, patientId: number, active: boolean }`  
**Limits:** Must have active INSTITUTION subscription. Max patients = plan's `maxPatients`.

#### POST /profiles/patients/{pid}/family-members/{fid}
**Request:** `{}`  
**Auth:** Ownership check — family profile `userId` must match JWT user  
**Response (201):** `{ id: number, familyMemberProfileId: number, patientId: number, active: boolean }`  
**Limits:** Free tier = 1 patient. FAMILY subscription = plan's `maxPatients`.

### Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 9 | `GET` | `/internal/profiles/patients/{id}/exists` | Internal | Check patient exists |
| 10 | `GET` | `/internal/profiles/patients/{id}` | Internal | Get patient |
| 11 | `GET` | `/internal/profiles/patients/{id}/care-team-members` | Internal | Get care team |
| 12 | `GET` | `/internal/profiles/doctors/{did}/can-attend/{pid}` | Internal | Doctor access check |
| 13 | `GET` | `/internal/profiles/family-members/{fid}/can-visit/{pid}` | Internal | Family access check |
| 14 | `GET` | `/internal/profiles/users/{uid}/can-access/{pid}` | Internal | User access check |

## Segment Mapping

| Frontend Segment | Profiles Endpoints |
|---|---|
| **Family Support Network** | 3, 4, 8, 2, 6 |
| **Care Staff** | 5, 6, 7, 2, 4 |
