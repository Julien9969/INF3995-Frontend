import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {SocketService} from '@app/services/socket/socket.service';
import {EmitFeedback, RobotInformation, WebsocketsEvents} from '@common';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}identify/${call}`;

@Injectable({
  providedIn: 'root'
})
export class RobotsService {
  private _robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject([] as RobotInformation[]);
  private _identify: Subject<EmitFeedback> = new Subject();
  private _headBackBase: Subject<EmitFeedback> = new Subject();

  constructor(private socketService: SocketService, public httpClient: HttpClient) {
    // Every second there's an update from the backend with the status
    this.socketService.on(WebsocketsEvents.ROBOT_STATUS, (update: string) => this.parseRobots(update));
  }

  get robots(): BehaviorSubject<RobotInformation[]> {
    return this._robots;
  }

  private parseRobots(rawUpdate: string) {
    const jsonUpdate = JSON.parse(rawUpdate);
    const update: RobotInformation[] = jsonUpdate.map((robot: RobotInformation) => ({
      id: robot.id,
      name: robot.name,
      battery: robot.battery,
      state: robot.state,
      lastUpdate: robot.lastUpdate,
      distance: robot.distance,
      position: {
        x: robot.position.x,
        y: robot.position.y
      }
    }));
    this._robots.next(update);
  }

  parseEmitFeedback(rawUpdate: string) {
    const jsonUpdate = JSON.parse(rawUpdate);
    const update: EmitFeedback = {
      timestamp: jsonUpdate.timestamp,
      message: jsonUpdate.message,
      robotId: jsonUpdate.robotId
    }
    this._headBackBase.next(update);
  }

  identify(robotId: number) {
    this.httpClient.get(localUrl(`${robotId}`)).subscribe((response) => {
      this._identify.next(response as EmitFeedback);
    });
    return this._identify.asObservable();
  }

  checkConnection() {
    return this.httpClient.get(localUrl('connected/')).subscribe((response) => {});
  }

  headBackBase() {
    this.socketService.send(WebsocketsEvents.HEADBACKBASE_REQUEST);
    return this._headBackBase.asObservable()
  }

}
