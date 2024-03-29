import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { WebsocketsEvents } from '@app/classes/websockets-events';
import { Logs } from '@app/classes/logs';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs = new BehaviorSubject<Logs[]>([]);
  constructor(private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.LOG_DATA, (newLog:string) => this.saveLog(newLog))
  }

  private saveLog(newLog: string){
    const parsedLog: Logs = JSON.parse(newLog)
    this._logs.next([parsedLog]);
  }

  get logs() {
    return this._logs;
  }
}
