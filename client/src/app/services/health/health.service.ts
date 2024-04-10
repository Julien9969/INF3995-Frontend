import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SocketService} from "@app/services/socket/socket.service";
import {HealthState, WebsocketsEvents} from "@common";


@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private _healthObservable: BehaviorSubject<HealthState> = new BehaviorSubject<HealthState>(HealthState.UNKNOWN);
  lastPing: number = Date.now();
  constructor(private socketClient: SocketService) {
    setInterval(() => {
      this.socketClient.send(WebsocketsEvents.PING, {});
      if(Date.now() - this.lastPing > 5000) {
        this._healthObservable.next(HealthState.UNHEALTHY);
      }
    }, 1000);

    this.socketClient.on(WebsocketsEvents.PONG, () => {
      this._healthObservable.next(HealthState.HEALTHY);
      this.lastPing = Date.now();
    });
  }

  get check() {
    return this._healthObservable;
  }
}
