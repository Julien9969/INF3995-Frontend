import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
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
    missionId: 0,
    startTimestamp: 0,
    elapsedTime: 0,
    count: 0,
    batteries: [],
    distances: []
  }
  private _status: BehaviorSubject<MissionStatus> = new BehaviorSubject(this.defaultStatus);

  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    // Every second there's an update from the backend with the status
    this.socketService.on(WebsocketsEvents.MISSION_STATUS, (update: string) => this.updateMission(update));
  }

  get status(): BehaviorSubject<MissionStatus> {
    return this._status;
  }

  updateMission(rawUpdate: string) {
    const jsonUpdate = JSON.parse(rawUpdate);
    const update: MissionStatus = {
      missionState: jsonUpdate.missionState as MissionState || MissionState.NOT_STARTED,
      missionId: jsonUpdate.missionId || 0,
      startTimestamp: jsonUpdate.startTimestamp || 0,
      elapsedTime: jsonUpdate.elapsedTime || 0,
      count: jsonUpdate.count || 0,
      batteries: jsonUpdate.batteries || [],
      distances: jsonUpdate.distances || []
    }
    this._status.next(update);
  }

  identify(robotId: number): Observable<string> {
    return this.http.get(localUrl(`identify/id/${robotId}`), {responseType: 'text'});
  }

  toggleMission() {
    const state = this._status.getValue().missionState;
    if (state == MissionState.ONGOING) {
      this.socketService.send(WebsocketsEvents.MISSION_END);
    } else {
      this.socketService.send(WebsocketsEvents.MISSION_START);
      this.socketService.send(WebsocketsEvents.MISSION_MAP);
    }
  }

  disconnect() {
    this.socketService.disconnect();
  }
}
