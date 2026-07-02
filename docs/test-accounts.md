# Test Accounts

Accounts created via IAM Service endpoints, verified with curl on 2026-07-01.

## Active Accounts

| # | Username | Password | Backend Role | Frontend Segment | ID | Status |
|---|---|---|---|---|---|---|
| 1 | `Catalina` | `Cata123` | `ROLE_USER` | Care Staff (CAREGIVER) | 2 | ✅ Active |
| 2 | `TESTAdmin` | `Admin123` | `ROLE_ADMIN` | Family Support (FAMILY_MEMBER) | 3 | ✅ Active |
| 3 | `Maria` | `Maria123` | `ROLE_ADMIN` | Family Support (FAMILY_MEMBER) | 4 | ✅ Active |
| 4 | `Carlos` | `Carlos123` | `ROLE_USER` | Care Staff (CAREGIVER) | 5 | ✅ Active |

## Role Mapping (Frontend ↔ Backend)

| Frontend Segment | Frontend Enum | → Backend Role |
|---|---|---|
| Family Support Network | `FAMILY_MEMBER` | `ROLE_ADMIN` |
| Care Staff | `CAREGIVER` | `ROLE_USER` |

## Valid Backend Roles (IAM Service)

| Role | Description |
|---|---|
| `ROLE_USER` | Default user |
| `ROLE_ADMIN` | Administrator |

Any other role string returns `401 Unauthorized` (deployed version behavior).

## Segment Access

| Frontend Segment | Test Users | Can Access Profiles? |
|---|---|---|
| Family Support Network | `TESTAdmin`, `Maria` | ✅ Yes |
| Care Staff | `Catalina`, `Carlos` | ❌ Not implemented yet |

## Failed Registration Attempts (401 — invalid role)

| Username | Password | Role Sent |
|---|---|---|
| `jeremy123` | `Jeremy123` | `FAMILY_MEMBER` (raw, no mapping) |
| `Catalina2` | `Cata123` | `FAMILY_MEMBER` |
| `Catalina3` | `Cata123` | `FAMILY_MEMBER` |
| `Pedro` | `Pedro123` | `FAMILY_MEMBER` |
| `TestFoo` | `Foo123` | `FOOBAR` |
| `FOOBAR_TEST` | `Test123` | `INVALID_ROLE` |

## API Endpoints

### IAM Service
- Direct: `https://medibridge-iam-service.onrender.com/api/v1`
- Gateway: `https://medibridge-api-gateway.onrender.com/api/v1`

### Profiles Service
- Direct: `https://medibridge-profiles-service.onrender.com/api/v1`
- Gateway: `https://medibridge-api-gateway.onrender.com/api/v1`

### Swagger UIs
- IAM: https://medibridge-iam-service.onrender.com/swagger-ui/index.html
- Profiles: https://medibridge-profiles-service.onrender.com/swagger-ui/index.html
- Gateway: https://medibridge-api-gateway.onrender.com/swagger-ui/index.html

## Known Backend Issues

1. **IAM internal endpoint `by-username` missing** in deployed `microservices` package — Profiles Service cannot resolve `userId` from JWT username. Blocks POST `/family-members` and POST `/patients/{pid}/family-members/{fid}`.
2. **IAM service returns 401 for invalid roles** instead of 400 (deploy discrepancy vs source code).
3. **Gateway times out for Profiles routes** — frontend must call Profiles Service directly.
