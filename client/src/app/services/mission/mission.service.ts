import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SocketService} from '@app/services/socket/socket.service';
import {MissionState, MissionStatus, WebsocketsEvents} from '@common';


@Injectable({
  providedIn: 'root'
})
export class MissionService {
  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    // Every second there's an update from the backend with the status
    this.socketService.on(WebsocketsEvents.MISSION_STATUS, (update: string) => this.updateMission(update));
  }

  private _status: BehaviorSubject<MissionStatus> = new BehaviorSubject({} as MissionStatus);

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
      robotCount: jsonUpdate.count || 0,
    }
    this._status.next(update);
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
