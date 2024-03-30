import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {environment} from "@environment";
import {WebsocketsEvents} from "@app/classes/websockets-events";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socketClient: Socket;

  constructor() {
    this.socketClient = io(environment.serverUrl, { transports: ['websocket'], upgrade: false });
  }

  join(id: string): void {
    this.socketClient.emit('joinRoom', id);
  }

  on<T>(event: string, action: (param: T) => void): void {
    this.socketClient.on(event, action);
  }

  send<T>(event: string, message?: T): void {
    if (message) {
      this.socketClient.emit(event, message);
    } else {
      this.socketClient.emit(event);
    }
  }

  disconnect(): void {
    this.socketClient.emit(WebsocketsEvents.ABORT_MISSION);
  }
}
