import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {environment} from "@environment";
import {WebsocketsEvents} from "@common";
import {BehaviorSubject} from "rxjs";
const TIMEOUT_MAX = 30;
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socketClient: Socket;
  private lastMessageTimestamp: number = 0;
  private _check: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() {
    this.socketClient = io(environment.serverUrl, { transports: ['websocket'], upgrade: false });
    this.lastMessageTimestamp = Date.now();
  }

  on<T>(event: string, action: (param: T) => void): void {
    this.socketClient.on(event, action);

    // Health Check
    if(Date.now() - this.lastMessageTimestamp > TIMEOUT_MAX) {
      this._check.next(true)
    } else {
      this._check.next(false)
    }
    this.lastMessageTimestamp = Date.now()
  }

  send<T>(event: string, message?: T): void {
    if (message) {
      this.socketClient.emit(event, message);
    } else {
      this.socketClient.emit(event);
    }
  }

  get check() {
    return this._check;
  }

  disconnect(): void {
    this.socketClient.emit(WebsocketsEvents.ABORT_MISSION);
  }
}
