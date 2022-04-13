import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebSocketClientMessage } from '../interfaces/websocket-message.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly WEB_SOCKET_URL = 'ws://localhost:3000';
  private webSocketSubject = webSocket<WebSocketClientMessage>(
    this.WEB_SOCKET_URL
  );

  public listen() {
    return this.webSocketSubject.asObservable();
  }

  public push() {
    this.webSocketSubject.next({
      source: 'client',
      content: 'response from client',
    });
  }

  public closeConnection() {
    this.webSocketSubject.complete();
  }

  public trowError() {
    this.webSocketSubject.error({ code: 400, reason: 'Some error' });
  }

  public openConnection() {
    this.webSocketSubject = webSocket<WebSocketClientMessage>(
      this.WEB_SOCKET_URL
    );
  }
}
