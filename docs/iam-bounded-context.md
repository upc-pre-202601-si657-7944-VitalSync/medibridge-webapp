# IAM Bounded Context — Technical Documentation

**Project:** MediBridge Web Application (Frontend)  
**Bounded Context:** Identity and Access Management (IAM)  
**Source of Truth:** `medibridge.microservices` → `services/iam-service`  
**Version:** Angular 21 + Spring Boot (Backend)  
**Last Updated:** 2026-07-01

---

## 1. Overview

The **IAM Bounded Context** is responsible for all identity, authentication, and authorization concerns within the MediBridge platform. It serves as the single source of truth for user credentials, roles, permissions, and JWT token issuance.

This context is the **entry point** for all users (patients, doctors, family members, caregivers) and provides the security foundation that all other Bounded Contexts depend on.

### Key Characteristics

- **JWT-based authentication** with RSA asymmetric keys (RS256)
- **Public key exposure** via JWKS endpoint for stateless validation by other services
- **Event-driven** — publishes `user.registered` to RabbitMQ
- **Internal token protection** — all business endpoints require `X-Internal-Token`
- **Clean Architecture** implementation (application / domain / infrastructure / interfaces)

---

## 2. Responsibilities

| Area                    | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| User Registration       | Create new user accounts with credentials and initial role                  |
| Authentication          | Validate credentials and issue signed JWT tokens                            |
| Token Validation        | Expose public RSA key via JWKS for other services to verify tokens          |
| Internal User Lookup    | Provide lightweight user existence and basic info endpoints for other BCs   |
| Role & Permission Model | Manage roles and permissions associated with each user (future expansion)   |
| Event Publishing        | Emit domain events when significant identity changes occur                  |

---

## 3. API Endpoints

All endpoints are exposed through the **API Gateway** at:

```
# Development
http://localhost:8080/api/v1/...

# Production (Render)
https://medibridge-api-gateway.onrender.com/api/v1/...
https://medibridge-iam-service.onrender.com/api/v1/...   (direct IAM)
```

### 3.1 Valid Roles

The IAM service only accepts these two role values:

| Role | Description |
|------|-------------|
| `ROLE_USER` | Default role for all registered users (Family Support Network, Care Staff, Patients, Doctors) |
| `ROLE_ADMIN` | Administrative role |

**Frontend ↔ Backend Role Mapping:**

| Frontend Segment | UserRole enum | Backend Role (sent to API) |
|-----------------|---------------|---------------------------|
| Family Support Network | `FAMILY_MEMBER` | `ROLE_ADMIN` |
| Care Staff | `CAREGIVER` | `ROLE_USER` |

Any other role value returns `401 Unauthorized` (the deployed version returns 401 for invalid roles instead of 400 as the source code suggests).

### 3.2 Authentication Endpoints

#### `POST /api/v1/authentication/sign-up`

**Purpose:** Register a new user in the system.

**Request Body (verified 2026-07-01):**
```json
{
  "username": "string",
  "password": "string",
  "roles": ["ROLE_USER"]
}
```

**Success Response:** `201 Created` + `UserResource`
```json
{
  "id": 2,
  "username": "Catalina",
  "roles": ["ROLE_USER"]
}
```

**Error Responses:**
- `400 Bad Request` — validation errors (per source code, may return 401 in deployed version)
- `401 Unauthorized` — invalid role string (deployed behavior)
- `409 Conflict` — username already exists

**Side Effects:**
- Creates user record in `iam` database
- Publishes `user.registered` event to RabbitMQ (`medibridge.events`)

---

#### `POST /api/v1/authentication/sign-in`

**Purpose:** Authenticate a user and return a JWT access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response:** `200 OK` + `AuthenticatedUserResource`
```json
{
  "id": 0,
  "username": "string",
  "token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Error Responses:**
- `401 Unauthorized` — invalid credentials
- `403 Forbidden` — account disabled or locked

**Token Details:**
- Algorithm: **RS256** (RSA + SHA-256)
- Signed with the private key managed by the IAM service
- Contains standard claims (`sub`, `iat`, `exp`, `roles`, etc.)
- The token is returned directly in the `token` field of the response (no separate `accessToken` / `tokenType` / `expiresIn` wrapper)

---

### 3.3 Public Key Exposure

#### `GET /api/v1/jwks/.well-known/jwks.json`

**Purpose:** Expose the current RSA public key(s) in JWK Set format.

This endpoint is **public** (no `X-Internal-Token` required) so that:
- Other microservices can fetch the public key to validate JWTs
- Frontend applications can use it for token introspection (if needed)
- External clients can verify token signatures

**Response:** Standard JWKS document
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "...",
      "n": "...",
      "e": "AQAB"
    }
  ]
}
```

**Important:**  
Other services (Profiles, Appointments, etc.) use this endpoint at startup or via `IAM_JWK_SET_URI` configuration to validate incoming JWTs.

---

### 3.4 Internal Endpoints (Protected)

These endpoints are intended **only** for communication between microservices via the API Gateway. They require the `X-Internal-Token` header.

#### `GET /api/v1/internal/users/{userId}/exists`

**Purpose:** Check whether a user exists (lightweight existence check).

**Headers:**
```
X-Internal-Token: <shared-internal-token>
```

**Success Response:** `200 OK` with boolean body or simple JSON.

#### `GET /api/v1/internal/users/{userId}`

**Purpose:** Retrieve basic user information (id, username, roles) for other bounded contexts.

**Headers:**
```
X-Internal-Token: <shared-internal-token>
```

**Use Cases:**
- Profiles service validates that a user exists before creating a patient/doctor profile
- Other services need to confirm user identity without full authentication flow

---

## 4. Security Model

### 4.1 Authentication Flow

1. Client calls `POST /sign-in` with username/password
2. IAM validates credentials against the database
3. IAM signs a JWT using its **private RSA key**
4. Client receives the JWT and includes it in subsequent requests (`Authorization: Bearer <token>`)
5. Other services validate the JWT signature using the **public key** from the JWKS endpoint

### 4.2 Authorization

- Business endpoints are protected by `X-Internal-Token` (service-to-service)
- User-facing endpoints rely on JWT claims (`roles`, `permissions`)
- Fine-grained authorization logic lives in each Bounded Context (not centralized in IAM)

### 4.3 Key Management

- RSA key pair is generated at startup if not provided via environment variables
- Recommended for production: inject stable `IAM_JWT_PRIVATE_KEY` and `IAM_JWT_PUBLIC_KEY`
- Keys are rotated by updating the environment variables and restarting the service

---

## 4.1 Verified API Contract (tested via curl 2026-07-01)

The production endpoints were verified against `medibridge-iam-service.onrender.com`:

- `POST /api/v1/authentication/sign-up` → `roles` must be `["ROLE_USER"]` or `["ROLE_ADMIN"]`. Returns `201 Created` with `{ id, username, roles }`. Invalid role strings return `401`.
- `POST /api/v1/authentication/sign-in` → returns `{ id, username, token }` (JWT RS256). Valid for both roles.
- `GET /api/v1/jwks/.well-known/jwks.json` → public JWKS endpoint, returns RSA public key
- Additional endpoints: `GET /api/v1/users`, `GET /api/v1/users/{userId}`, `GET /api/v1/roles`

### Verified Test Accounts

| Username | Password | Role | ID | Status |
|----------|----------|------|----|--------|
| `Catalina` | `Cata123` | `ROLE_USER` | 2 | Created + Login OK |
| `TESTAdmin` | `Admin123` | `ROLE_ADMIN` | 3 | Created + Login OK |
| `Maria` | `Maria123` | `ROLE_ADMIN` | 4 | Created + Login OK |
| `Carlos` | `Carlos123` | `ROLE_USER` | 5 | Created + Login OK |

### Role strings tested and rejected (401)

`FAMILY_MEMBER`, `CAREGIVER`, `PATIENT`, `DOCTOR`, `FOOBAR`, `INVALID_ROLE` — all return `401 Unauthorized` instead of `400 Bad Request` (backend source code discrepancy).

---

## 5. Domain Events

| Event              | Trigger                    | Destination     | Purpose |
|--------------------|----------------------------|-----------------|---------|
| `user.registered`  | Successful sign-up         | RabbitMQ        | Notify other BCs (e.g., Profiles) that a new user exists |

**Exchange:** `medibridge.events`  
**Routing Key:** `user.registered`

---

## 6. Integration Points

### 6.1 Downstream Consumers

- **Profiles Service** — calls internal user endpoints to validate existence before creating profiles
- **All other services** — validate JWTs using the JWKS endpoint

### 6.2 Upstream Dependencies

- **PostgreSQL** (`medibridge_iam`)
- **RabbitMQ** (for event publishing)
- **API Gateway** (routes all traffic and injects `X-Internal-Token`)

---

## 7. Configuration (Environment Variables)

| Variable                    | Default                                      | Description |
|----------------------------|----------------------------------------------|-----------|
| `IAM_DB_URL`               | `jdbc:postgresql://localhost:5433/medibridge_iam` | Database connection string |
| `IAM_DB_USERNAME`          | `postgres`                                   | DB user |
| `IAM_DB_PASSWORD`          | `12345678`                                   | DB password |
| `RABBITMQ_HOST`            | `localhost`                                  | Message broker host |
| `IAM_JWT_PRIVATE_KEY`      | (auto-generated)                             | RSA private key (PKCS8 PEM or Base64 DER) |
| `IAM_JWT_PUBLIC_KEY`       | (auto-generated)                             | RSA public key (X509 PEM or Base64 DER) |
| `INTERNAL_SERVICE_TOKEN`   | `local-internal-token`                       | Shared token for internal service calls |

---

## 8. Frontend Implications (Angular)

When implementing the **IAM Feature Module** in the Angular frontend, the following contracts must be respected:

- Use `POST /api/v1/authentication/sign-in` for login — response is `{ id, username, token }`
- Use `POST /api/v1/authentication/sign-up` for registration — `roles` is sent as an array
- Store the returned JWT securely (prefer `httpOnly` cookie or secure storage)
- Include `Authorization: Bearer <token>` on all authenticated requests
- Handle token expiration and refresh (future requirement)
- The `LanguageToggleComponent` (ES | EN) is present on auth screens and reusable across the application
- Never expose `X-Internal-Token` in the frontend — it is only for service-to-service communication

---

## 9. Open Questions / Future Work

- Role and permission management endpoints are not yet documented
- Password reset / email verification flows are not specified
- Token refresh mechanism is not defined
- Multi-factor authentication support is not mentioned

---

## 10. Frontend Architecture — DDD Structure (MediBridge)

### 10.1 Guiding Principles

- **One Feature Module = One Bounded Context**  
  Cada Bounded Context del backend (`iam-service`, `profiles-service`, etc.) se mapeará 1:1 a un feature module en `src/app/features/`.

- **Clean / Hexagonal inside each feature**  
  Dentro de cada feature se respeta la separación:
  - `domain/` → modelos, interfaces, enums, value objects
  - `application/` → facades, use cases, application services, state management
  - `infrastructure/` → API clients, mappers, persistence adapters
  - `presentation/` → smart components + pages (container components)
  - `ui/` → dumb / presentational components específicos del feature

- **Core vs Shared separation**
  - `core/` → singleton, cross-cutting concerns (auth, HTTP interceptors, guards, config)
  - `shared/` → componentes UI reutilizables (atomic design), pipes, validators, helpers

- **Standalone Components + Signals** (Angular 21 default)
- **Lazy Loading** por feature en `app.routes.ts`
- **English folder names** (convención del proyecto)

### 10.2 Proposed Folder Structure

```
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.store.ts          # signals-based auth state
│   │   ├── auth.guard.ts
│   │   ├── login.interceptor.ts
│   │   └── models/
│   ├── http/
│   │   ├── api.service.ts
│   │   ├── error.interceptor.ts
│   │   └── http-context.ts
│   ├── config/
│   │   └── environment.ts
│   └── index.ts
│
├── shared/
│   ├── ui/
│   │   ├── button/
│   │   ├── input/
│   │   ├── card/
│   │   └── ...
│   ├── utils/
│   │   ├── validators/
│   │   └── helpers.ts
│   └── index.ts
│
├── features/
│   ├── iam/
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── auth-response.model.ts
│   │   │   │   └── jwt-payload.model.ts
│   │   │   ├── enums/
│   │   │   │   └── user-role.enum.ts
│   │   │   └── index.ts
│   │   ├── application/
│   │   │   ├── facades/
│   │   │   │   └── iam.facade.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   └── register.use-case.ts
│   │   │   └── state/
│   │   │       └── auth.store.ts
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   │   └── iam-api.service.ts
│   │   │   ├── mappers/
│   │   │   │   └── auth-response.mapper.ts
│   │   │   └── index.ts
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   │   ├── login-page/
│   │   │   │   └── register-page/
│   │   │   ├── components/
│   │   │   │   └── login-form/
│   │   │   └── iam.routes.ts
│   │   ├── ui/
│   │   │   └── (feature-specific dumb components)
│   │   └── index.ts
│   │
│   ├── profiles/          # future BC
│   ├── appointments/      # future BC
│   ├── medication/        # future BC
│   ├── health-monitoring/
│   ├── messaging/
│   ├── payments/
│   └── reports-analytics/
│
├── app.routes.ts
├── app.config.ts
└── app.ts
```

### 10.3 Naming & Responsibility Rules

| Layer            | Naming Convention                  | Responsibility |
|------------------|------------------------------------|----------------|
| `domain/models`  | `*.model.ts`                       | TypeScript interfaces + classes representing domain concepts |
| `domain/enums`   | `*.enum.ts`                        | Enumerations used across the feature |
| `application`    | `*.facade.ts`, `*.use-case.ts`     | Orchestration logic, state management, business rules coordination |
| `infrastructure` | `*-api.service.ts`, `*.mapper.ts`  | HTTP calls, data transformation, external adapters |
| `presentation`   | `*-page/`, `*-form/`               | Container/smart components that connect to facades |
| `ui`             | Atomic or feature-specific dumb components | Pure presentation, no business logic |

### 10.4 Trade-offs Accepted

1. **Facade + Signals Store** inside `application/` for IAM (and future features) instead of flattening everything into presentation.
2. **Feature-specific `ui/` folder** allowed when components are not reusable outside the BC.
3. **English naming** for all folders and files (project convention).

### 10.5 Implementation Order (IAM First)

1. `core/auth/` + JWT handling
2. `shared/ui/` basic components (Button, Input, Card)
3. `features/iam/domain/`
4. `features/iam/infrastructure/`
5. `features/iam/application/`
6. `features/iam/presentation/` + routes
7. Lazy loading integration in `app.routes.ts`

---

**Document Owner:** Frontend Architecture Team  
**Reviewers:** Backend Team (VitalSync)  
**Next Review:** After IAM feature implementation and first integration test with live backend
