import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { SocketService } from '../socket/socket.service';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private _ongoingMission = false;
  constructor(private http: HttpClient, private readonly socketService: SocketService) {
    this.socketService.join("mission");
    this.socketService.on("mission-start", () => {
      if(this._ongoingMission) {
        console.log("Mission has already started")
      } else {
        this._ongoingMission = true;
        console.log("Starting mission now!")
      }
    })
    this.socketService.on("mission-stop", () => {
      if(this._ongoingMission) {
        this._ongoingMission = true;
        console.log("Stopping mission now!")
      } else {
        console.log("Mission is not ongoing!")
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
      if (this.ongoingMission){
        this.socketService.send(`stop-mission`);
      } else{
        this.socketService.send(`start-mission`);
      }
  }
}
