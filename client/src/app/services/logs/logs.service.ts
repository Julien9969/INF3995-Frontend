import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { WebsocketsEvents } from '@app/classes/websockets-events';
import { Logs } from '@app/classes/logs';
import { Observable, Subject } from 'rxjs';

const LOGS: Logs[] = [
  {
    logId: 1,
    robotId: 11,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
  {
    logId: 2,
    robotId: 9,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
  {
    logId: 3,
    robotId: 50,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
]


@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private _logs = new Subject<Logs[]>();
  constructor(private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.LOG_DATA, (newLog: Logs) => {
      this._logs.next([newLog]);
    })
  }

  get logs(): Observable<Logs[]> {
    return this._logs.asObservable();
  }

  add() {
    this._logs.next(LOGS);
  }
}
