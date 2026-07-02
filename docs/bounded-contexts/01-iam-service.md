# IAM Service — API Reference

**Service:** Identity and Access Management  
**Base URL:** `https://medibridge-iam-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

### Authentication

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/authentication/sign-in` | Public | Login, returns JWT |
| 2 | `POST` | `/authentication/sign-up` | Public | Register new user |

#### POST /authentication/sign-in
**Request:** `{ username: string, password: string }`  
**Response (200):** `{ id: number, username: string, token: string }`

#### POST /authentication/sign-up
**Request:** `{ username: string, password: string, roles: string[] }`  
**Response (201):** `{ id: number, username: string, roles: string[] }`

Valid roles: `ROLE_USER`, `ROLE_ADMIN`

### Users

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 3 | `GET` | `/users` | JWT | List all users |
| 4 | `GET` | `/users/{userId}` | JWT | Get user by ID |

**Response:** `{ id: number, username: string, roles: string[] }`

### Roles

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 5 | `GET` | `/roles` | JWT | List all roles |

**Response:** `{ id: number, name: string }`

### Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 6 | `GET` | `/internal/users/{userId}/exists` | Internal | Check user exists |
| 7 | `GET` | `/internal/users/{userId}` | Internal | Get user by ID |
| 8 | `GET` | `/internal/users/by-username/{username}` | Internal | Get user by username |

### JWKS

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 9 | `GET` | `/jwks/.well-known/jwks.json` | Public | RSA public key (JWK Set) |
