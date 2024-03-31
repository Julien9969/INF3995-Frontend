import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {SocketService} from '@app/services/socket/socket.service';
import {WebsocketsEvents} from '@app/classes/websockets-events';
export interface RobotInformation {
  id: number,
  name: string,
  battery: number,
  status: string,
  lastUpdate: number,
  position: {
    x: number,
    y: number
  }
}

export interface EmitFeedback {
  timestamp: number,
  message: string,
  robotId: number
}

@Injectable({
  providedIn: 'root'
})
export class RobotsService {
  private _robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject([] as RobotInformation[]);
  private _identify: Subject<EmitFeedback> = new Subject();
  private _headBackBase: Subject<EmitFeedback> = new Subject();

  constructor(private socketService: SocketService) {
    // Every second there's an update from the backend with the status
    this.socketService.on(WebsocketsEvents.ROBOT_CONNECTED, (update: string) => this.parseRobots(update));
    this.socketService.on(WebsocketsEvents.IDENTIFY_FEEDBACK, (update: string) => this.parseEmitFeedback(update));
    this.socketService.on(WebsocketsEvents.HEADBACKBASE_FEEDBACK, (update: string) => this.parseEmitFeedback(update));
  }

  get robots(): BehaviorSubject<RobotInformation[]> {
    return this._robots;
  }

  private parseRobots(rawUpdate: string) {
    const jsonUpdate = JSON.parse(rawUpdate);
    const update: RobotInformation[] = jsonUpdate.map((robot: any) => ({
      id: robot.id,
      name: robot.name,
      battery: robot.battery,
      status: robot.status,
      lastUpdate: robot.lastUpdate,
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
    if (jsonUpdate.message === 'Identify request sent') {
      this._identify.next(update);
    } else {
      this._headBackBase.next(update);
    }
  }

  identify(robotId: number) {
    this.socketService.send(WebsocketsEvents.IDENTIFY_REQUEST, robotId);
    return this._identify.asObservable()
  }

  headBackBase() {
    this.socketService.send(WebsocketsEvents.HEADBACKBASE_REQUEST);
    return this._headBackBase.asObservable()
  }

}
