import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { WebsocketsEvents } from '@app/classes/websockets-events';
import { Logs } from '@app/classes/logs';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs = new Subject<Logs[]>();
  constructor(private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.LOG_DATA, (newLog:string) => {
      const parsedLog: Logs = JSON.parse(newLog)
      this._logs.next([parsedLog]);
    })
  }

  get logs(): Observable<Logs[]> {
    return this._logs.asObservable();
  }

}
