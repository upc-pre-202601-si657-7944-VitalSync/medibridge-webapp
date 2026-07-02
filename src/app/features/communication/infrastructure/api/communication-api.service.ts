import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const CHAT = 'https://medibridge-communication-service.onrender.com/api/v1/chat';
const NOTIF = 'https://medibridge-communication-service.onrender.com/api/v1/notifications';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderUserId: number;
  recipientUserId: number;
  content: string;
  sentAt: string;
}

export interface Notification {
  id: string;
  recipientUserId: number;
  patientId: number;
  type: string;
  channel: string;
  status: string;
  title: string;
  message: string;
  sourceEvent: string;
  createdAt: string;
  readAt: string | null;
}

@Injectable()
export class CommunicationApiService {
  private readonly http = inject(HttpClient);

  sendMessage(payload: { recipientUserId: number; content: string; sentAt: string }): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${CHAT}/messages`, payload);
  }

  getConversation(senderId: number, recipientId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${CHAT}/messages/${senderId}/${recipientId}`);
  }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${NOTIF}/recipients/${userId}`);
  }

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${NOTIF}/recipients/${userId}/unread`);
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${NOTIF}/${id}/read`, {});
  }
}
