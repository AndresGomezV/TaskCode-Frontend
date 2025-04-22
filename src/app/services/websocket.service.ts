import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Notification } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client;
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();
  private connectedUserId: number | null = null;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log('[WebSocket]', str),
      onConnect: () => {
        console.log('📡 STOMP conectado');

        if (this.connectedUserId) {
          const destination = `/user/${this.connectedUserId}/queue/notifications`;
          console.log(`📡 Conectado y suscrito a: ${destination}`);
          this.subscribeToNotifications(this.connectedUserId);
        }
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error', frame);
      }
    });
  }

  connect(userId: number): void {
    this.connectedUserId = userId;


    if (this.stompClient.connected) {
      this.subscribeToNotifications(userId);
    }

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient.deactivate();
  }

  private subscribeToNotifications(userId: number): void {
    const destination = `/user/${userId}/queue/notifications`;

    this.stompClient.subscribe(destination, (message: IMessage) => {
      const notification: Notification = JSON.parse(message.body);
      this.notificationSubject.next(notification);
    });
  }
}
