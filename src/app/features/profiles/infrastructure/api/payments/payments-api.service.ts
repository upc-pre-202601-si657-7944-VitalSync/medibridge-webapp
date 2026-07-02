import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE = 'https://medibridge-payments-service.onrender.com/api/v1';

export interface Subscription {
  id: number;
  userId: number;
  plan: { id: number; commercialLine: string; planType: string; billingCycle: string; price: number; currency: string; displayName: string; maxPatients: number };
  status: string;
  stripeCustomerId: string;
  startedAt: string;
  currentPeriodEnd: string;
}

export interface Invoice {
  id: number;
  userId: number;
  subscriptionId: number;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
}

export interface CreateSubscriptionPayload {
  userId: number;
  commercialLine: string;
  planType: string;
  billingCycle: string;
}

@Injectable()
export class PaymentsApiService {
  private readonly http = inject(HttpClient);

  getActiveSubscription(userId: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${BASE}/subscriptions/users/${userId}/active`);
  }

  createSubscription(payload: CreateSubscriptionPayload): Observable<Subscription> {
    return this.http.post<Subscription>(`${BASE}/subscriptions`, payload);
  }

  cancelSubscription(id: number): Observable<Subscription> {
    return this.http.post<Subscription>(`${BASE}/subscriptions/${id}/cancel`, {});
  }

  getInvoices(userId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${BASE}/invoices/users/${userId}`);
  }

  addPaymentMethod(payload: { userId: number; brand: string; lastFourDigits: string; stripePaymentMethodId: string }): Observable<unknown> {
    return this.http.post(`${BASE}/subscriptions/payment-methods`, payload);
  }
}
