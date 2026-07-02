# Payments Service — API Reference

**Service:** Subscriptions, Invoices & Payment Methods  
**Base URL:** `https://medibridge-payments-service.onrender.com/api/v1`  
**Version:** 2026-07-02

## Endpoints

### Subscriptions

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 1 | `POST` | `/subscriptions` | JWT | Create subscription |
| 2 | `POST` | `/subscriptions/{id}/cancel` | JWT | Cancel subscription |
| 3 | `POST` | `/subscriptions/{id}/renew` | JWT | Renew subscription |
| 4 | `GET` | `/subscriptions/users/{userId}` | JWT | Get user subscription |
| 5 | `GET` | `/subscriptions/users/{userId}/active` | JWT | Get active subscription |
| 6 | `POST` | `/subscriptions/payment-methods` | JWT | Add payment method |

### Invoices

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 7 | `GET` | `/invoices/users/{userId}` | JWT | Get user invoices |

### Stripe Webhook

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 8 | `POST` | `/stripe-webhooks` | Public | Stripe payment events |

### Internal

| # | Method | Path | Auth | Description |
|---|---|---|---|---|
| 9 | `GET` | `/internal/subscriptions/users/{userId}/active` | Internal | Get active subscription |

### POST /subscriptions
**Request:**
```json
{
  "userId": 3,
  "commercialLine": "FAMILY",
  "planType": "FAMILY_PREMIUM",
  "billingCycle": "MONTHLY"
}
```
**CommercialLine enum:** `FAMILY`, `INSTITUTION`  
**PlanType enum:** `FREE`, `FAMILY_PREMIUM`, `INSTITUTION_BASIC`, `INSTITUTION_PREMIUM`  
**BillingCycle enum:** `MONTHLY`, `ANNUALLY`

**Response (201):**
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
**SubscriptionStatus enum:** `ACTIVE`, `CANCELLED`, `PAST_DUE`, `TRIALING`

### POST /subscriptions/payment-methods
**Request:** `{ userId, brand: "Visa", lastFourDigits: "4242", stripePaymentMethodId: "pm_xxx" }`  
**Response (201):** `{ id, userId, brand, lastFourDigits, stripePaymentMethodId }`
