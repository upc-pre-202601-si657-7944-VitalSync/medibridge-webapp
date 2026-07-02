# Communication Service — API Reference

**Service:** Chat & Notifications  
**Base URL:** `https://medibridge-communication-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

### Chat Messages

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/chat/messages` | JWT | Send message |
| 2 | `GET` | `/chat/messages/{senderId}/{recipientId}` | JWT | Get conversation |

#### POST /chat/messages
**Request:**
```json
{
  "recipientUserId": 10,
  "content": "Hola, ¿cómo está el paciente?",
  "sentAt": "2026-07-02T10:00:00Z"
}
```
**Response (201):**
```json
{
  "id": "abc123",
  "chatId": "derived-chat-id",
  "senderUserId": 3,
  "recipientUserId": 10,
  "content": "Hola, ¿cómo está el paciente?",
  "sentAt": "2026-07-02T10:00:00Z"
}
```

#### GET /chat/messages/{senderId}/{recipientId}
**Auth:** Caller must be one of the participants  
**Response (200):** `ChatMessageResource[]`

### Connected Users

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 3 | `POST` | `/chat/users/connect` | JWT | Mark user as online |
| 4 | `POST` | `/chat/users/disconnect` | JWT | Mark user as offline |
| 5 | `GET` | `/chat/users/connected` | JWT | List online users |

#### POST /chat/users/connect
**Request:** `{ userId: number, username?: string, fullName?: string }`  
**Response (200):** `{ id, userId, username, fullName, status: "ONLINE", connectedAt, disconnectedAt }`

### Notifications

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 6 | `GET` | `/notifications/recipients/{userId}` | JWT | Get all notifications |
| 7 | `GET` | `/notifications/recipients/{userId}/unread` | JWT | Get unread notifications |
| 8 | `PATCH` | `/notifications/{id}/read` | JWT | Mark as read |

#### Notification Resource
```json
{
  "id": "abc123",
  "recipientUserId": 3,
  "patientId": 1,
  "type": "DOSE_SKIPPED",
  "channel": "IN_APP",
  "status": "UNREAD",
  "title": "Dosis omitida",
  "message": "El paciente no tomó su medicación de las 08:00",
  "sourceEvent": "dose-1",
  "createdAt": "2026-07-02T10:00:00Z",
  "readAt": null
}
```
**NotificationType enum:** `CRITICAL_ALERT`, `DOSE_ADMINISTERED`, `DOSE_SKIPPED`, `STOCK_LOW`, `SYSTEM`  
**NotificationStatus enum:** `UNREAD`, `READ`
