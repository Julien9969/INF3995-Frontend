import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { WebsocketsEvents } from '@app/classes/websockets-events';
import { Logs } from '@app/classes/logs';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs = new Subject<Logs[]>();
  private _batteries = new BehaviorSubject<Map<number, number>>(new Map());
  constructor(private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.LOG_DATA, (newLog:string) => this.saveLog(newLog))
  }

  private saveLog(newLog: string){
    const parsedLog: Logs = JSON.parse(newLog)
    // Parse battery logs differently
    // if(parsedLog.eventType == "battery") {
    //   const batteryValue = parsedLog.message;
    //   const robotId = parsedLog.robotId;
    //   this._batteries.getValue().set(robotId, Number(batteryValue));
    //   this._batteries.next(this._batteries.getValue());
    // } else { // Info logs are transferred
      this._logs.next([parsedLog]);
    // }
  }

  get logs(): Observable<Logs[]> {
    return this._logs.asObservable();
  }

  get batteries(): Observable<Map<number, number>> {
    return this._batteries.asObservable();
  }

}
