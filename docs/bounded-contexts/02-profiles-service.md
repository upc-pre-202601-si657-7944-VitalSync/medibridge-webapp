# Profiles Service — API Reference

**Service:** Profiles & Care Relationships  
**Base URL:** `https://medibridge-profiles-service.onrender.com/api/v1`  
**Version:** 2026-07-02

---

## Family Support Network

> Perfil de familiar vinculado a un paciente.

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/profiles/family-members` | JWT | Crear perfil de familiar |
| 2 | `GET` | `/profiles/family-members/{id}` | JWT | Ver perfil de familiar |
| 3 | `POST` | `/profiles/patients/{pid}/family-members/{fid}` | JWT | Vincular familiar a paciente |
| 4 | `GET` | `/profiles/patients/{id}` | JWT | Ver paciente vinculado |
| 5 | `GET` | `/profiles/doctors/{id}` | JWT | Ver médico tratante |

### POST /profiles/family-members
**Request:** `{ fullName: string }`  
**Auth:** Extrae `userId` del JWT `sub` → IAM `by-username`  
**Response (201):** `{ id: number, userId: number, fullName: string }`

### POST /profiles/patients/{pid}/family-members/{fid}
**Request:** `{}`  
**Auth:** El `userId` del perfil familiar debe coincidir con el JWT  
**Response (201):** `{ id: number, familyMemberProfileId: number, patientId: number, active: boolean }`  
**Límite:** Tier gratis = 1 paciente. Suscripción FAMILY = `maxPatients` del plan.

---

## Care Staff

> Perfil de doctor / cuidador que atiende pacientes.

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/profiles/doctors` | JWT | Crear perfil de doctor |
| 2 | `GET` | `/profiles/doctors/{id}` | JWT | Ver perfil de doctor |
| 3 | `POST` | `/profiles/patients/{pid}/doctors/{did}` | JWT | Asignar doctor a paciente |
| 4 | `GET` | `/profiles/patients/{id}` | JWT | Ver paciente asignado |
| 5 | `GET` | `/profiles/family-members/{id}` | JWT | Ver familiar del paciente |

### POST /profiles/doctors
**Request:** `{ fullName: string }`  
**Auth:** Extrae `userId` del JWT `sub` → IAM `by-username`  
**Response (201):** `{ id: number, userId: number, fullName: string }`

### POST /profiles/patients/{pid}/doctors/{did}
**Request:** `{}`  
**Auth:** El `userId` del perfil doctor debe coincidir con el JWT. Requiere suscripción INSTITUTION.  
**Response (201):** `{ id: number, doctorProfileId: number, patientId: number, active: boolean }`  
**Límite:** Máx pacientes = `maxPatients` del plan INSTITUTION.

---

## Internal (servicio a servicio)

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `GET` | `/internal/profiles/patients/{id}/exists` | Internal | Verificar si existe paciente |
| 2 | `GET` | `/internal/profiles/patients/{id}` | Internal | Obtener paciente |
| 3 | `GET` | `/internal/profiles/patients/{id}/care-team-members` | Internal | Obtener equipo de cuidado |
| 4 | `GET` | `/internal/profiles/doctors/{did}/can-attend/{pid}` | Internal | Verificar acceso doctor |
| 5 | `GET` | `/internal/profiles/family-members/{fid}/can-visit/{pid}` | Internal | Verificar acceso familiar |
| 6 | `GET` | `/internal/profiles/users/{uid}/can-access/{pid}` | Internal | Verificar acceso usuario genérico |
