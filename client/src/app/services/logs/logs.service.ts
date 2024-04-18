import {Injectable} from '@angular/core';
import {SocketService} from '../socket/socket.service';
import {Logs, WebsocketsEvents} from '@common';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  constructor(private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.LOG_DATA, (newLog: string) => this.saveLog(newLog))
  }

  private _logs = new BehaviorSubject<Logs[]>([]);

  get logs() {
    return this._logs;
  }

  private saveLog(newLog: string) {
    const parsedLog: Logs = JSON.parse(newLog)
    this._logs.next([parsedLog]);
  }
}
