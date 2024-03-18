import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from "rxjs";
import {map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import {SocketService} from '@app/services/socket/socket.service';
import {WebsocketsEvents} from '@app/classes/websockets-events';
import {MissionState, MissionStatus} from '@app/classes/mission-status';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;


@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private defaultStatus: MissionStatus = {
    missionState: MissionState.NOT_STARTED,
    startTimestamp: 0,
    elapsedTime: 0,
    count: 2,
    batteries: [],
    distances: []
  }
  private _status: BehaviorSubject<MissionStatus> = new BehaviorSubject(this.defaultStatus);

  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    // Every second there's an update from the backend with the status
    this.socketService.on(WebsocketsEvents.MISSION_STATUS, (rawUpdate: string) => {
      const jsonUpdate = JSON.parse(rawUpdate);
      const update: MissionStatus = {
        missionState: jsonUpdate.missionState as MissionState || MissionState.NOT_STARTED,
        startTimestamp: jsonUpdate.startTimestamp || 0,
        elapsedTime: jsonUpdate.elapsedTime || 0,
        count: jsonUpdate.count || 0,
        batteries: jsonUpdate.batteries || [],
        distances: jsonUpdate.distances || []
      }
      this._status.next(update);
    })
    this.socketService.send(WebsocketsEvents.MISSION_STATUS); // Retrieves status upon initialization of the service
  }

  identify(robotId: number): Observable<string> {
    return this.http.get(localUrl(`identify/id/${robotId}`), {responseType: 'text'})
      .pipe(
        map(response => response.toString())
      );
  }

  toggleMission() {
    if (this._status.getValue().missionState == MissionState.ONGOING) {
      this.socketService.send(WebsocketsEvents.MISSION_END);
    } else if (this._status.getValue().missionState == MissionState.NOT_STARTED || this._status.getValue().missionState == MissionState.ENDED){
      this.socketService.send(WebsocketsEvents.MISSION_START);
    }
  }

  get status(): BehaviorSubject<MissionStatus> {
    return this._status;
  }
}
