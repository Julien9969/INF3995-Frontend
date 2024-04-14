import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {SocketService} from '@app/services/socket/socket.service';
import {EmitFeedback, ReceivedRobotInformation, RobotInformation, WebsocketsEvents} from '@common';
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
    const update: RobotInformation[] = jsonUpdate.map((robot: ReceivedRobotInformation) => ({
      id: robot.id,
      name: robot.name,
      battery: robot.battery,
      state: robot.state,
      lastUpdate: robot.lastUpdate,
      distance: robot.distance,
      position: JSON.parse(robot.position.replaceAll('\'', '"')),
    }));
    this._robots.next(update);
  }


  identify(robotId: number) {
    this.httpClient.get(localUrl(`${robotId}`)).subscribe((response) => {
      this._identify.next(response as EmitFeedback);
    });
    return this._identify.asObservable();
  }

  headBackBase() {
    this.httpClient.get(localUrl(`identify`)).subscribe((response) => {
      this._headBackBase.next(response as EmitFeedback);
    });
    return this._headBackBase.asObservable()
  }

}
