import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { SocketService } from '@app/services/socket/socket.service';
import {MissionEvents} from '@app/services/mission/mission-events';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private _ongoingMission = false;
  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    this.socketService.join("mission");
    this.socketService.on(MissionEvents.MISSION_START, () => {
      if(this._ongoingMission) {
        console.log("Mission has already started")
      } else {
        this._ongoingMission = true;
        console.log("Starting mission now!")
      }
    })
    this.socketService.on("event", (msg) => {
      if(this._ongoingMission) {
        this._ongoingMission = true;
        console.log("Stopping mission now!", msg)
      } else {
        console.log("Mission is not ongoing!", msg)
      }
    })
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
      // if (this.ongoingMission){
        console.log("toggling mission");
        this.socketService.send(MissionEvents.TEST_EVENT, "message");
      // } else{
      //   this.socketService.send(``);
      // }
  }
}
