# Payments Service — API Reference

**Base URL:** `https://medibridge-payments-service.onrender.com/api/v1`  
**Version:** 2026-07-02

---

## Family Support Network

> `commercialLine = "FAMILY"` → `planType: FREE | FAMILY_PREMIUM`

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/subscriptions` | JWT | Crear suscripción FAMILY. `{userId, commercialLine: "FAMILY", planType, billingCycle}` |
| 2 | `POST` | `/subscriptions/{id}/cancel` | JWT | Cancelar suscripción |
| 3 | `GET` | `/subscriptions/users/{userId}/active` | JWT | Ver suscripción activa → `{plan: {maxPatients}, status}` |
| 4 | `GET` | `/invoices/users/{userId}` | JWT | Ver facturas |
| 5 | `POST` | `/subscriptions/payment-methods` | JWT | Agregar método de pago. `{userId, brand, lastFourDigits, stripePaymentMethodId}` |

---

## Care Staff

> `commercialLine = "INSTITUTION"` → `planType: INSTITUTION_BASIC | INSTITUTION_PREMIUM`

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/subscriptions` | JWT | Crear suscripción INSTITUTION. `{userId, commercialLine: "INSTITUTION", planType, billingCycle}` |
| 2 | `POST` | `/subscriptions/{id}/cancel` | JWT | Cancelar suscripción |
| 3 | `GET` | `/subscriptions/users/{userId}/active` | JWT | Ver suscripción activa |
| 4 | `GET` | `/invoices/users/{userId}` | JWT | Ver facturas |
| 5 | `POST` | `/subscriptions/payment-methods` | JWT | Agregar método de pago |

---

## Enums

**CommercialLine:** `FAMILY` | `INSTITUTION`  
**PlanType:** `FREE` | `FAMILY_PREMIUM` | `INSTITUTION_BASIC` | `INSTITUTION_PREMIUM`  
**BillingCycle:** `MONTHLY` | `ANNUALLY`  
**SubscriptionStatus:** `ACTIVE` | `CANCELLED` | `PAST_DUE` | `TRIALING`

---

## Response: Subscription
```json
{
  "id": 1,
  "userId": 3,
  "plan": {
    "id": 2,
    "commercialLine": "FAMILY",
    "planType": "FAMILY_PREMIUM",
    "billingCycle": "MONTHLY",
    "price": 29.99,
    "currency": "PEN",
    "displayName": "Family Premium",
    "maxPatients": 5
  },
  "status": "ACTIVE",
  "stripeCustomerId": "cus_xxx",
  "startedAt": "2026-07-02",
  "currentPeriodEnd": "2026-08-02"
}
```

## Stripe Webhook (público)

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| — | `POST` | `/stripe-webhooks` | Public | Eventos de pago de Stripe |

## Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| — | `GET` | `/internal/subscriptions/users/{userId}/active` | Internal | Suscripción activa (servicio a servicio) |
