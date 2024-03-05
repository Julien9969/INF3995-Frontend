import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { SocketService } from '@app/services/socket/socket.service';
import {WebsocketsEvents} from '@app/classes/websockets-events';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private _ongoingMission = false;
  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    this.socketService.on(WebsocketsEvents.MISSION_STATUS, (isMissionOngoing) => {
      this._ongoingMission = Boolean(isMissionOngoing);
    })
    this.socketService.on(WebsocketsEvents.MISSION_START, () => {
      this._ongoingMission = true;
    })
    this.socketService.on(WebsocketsEvents.MISSION_END, () => {
      this._ongoingMission = false;
    })
    this.socketService.send(WebsocketsEvents.MISSION_STATUS); // Retrieves status upon initialization of the service
  }

  identify(robotId: number): Observable<string> {
    return this.http.get(localUrl(`identify/id/${robotId}`), { responseType: 'text' })
      .pipe(
        map(response => response.toString())
      );
  }

  get ongoingMission(): boolean {
    return this._ongoingMission;
  }

  toggleMission() {
      if (this.ongoingMission){
        this.socketService.send(WebsocketsEvents.MISSION_END);
      } else{
         this.socketService.send(WebsocketsEvents.MISSION_START);
      }
  }
}
