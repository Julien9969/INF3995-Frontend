import {Injectable} from '@angular/core';
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import {BehaviorSubject} from "rxjs";
import {Logs, MissionStatus, RobotInformation} from "@common";

const localUrl = (call: string) => `${environmentExt.apiUrl}history/${call}`;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _missions: BehaviorSubject<MissionStatus[]> = new BehaviorSubject<MissionStatus[]>([]);
  private _logs: BehaviorSubject<Logs[]> = new BehaviorSubject<Logs[]>([]);
  private _map: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(new Image());
  private _status: BehaviorSubject<MissionStatus> = new BehaviorSubject<MissionStatus>({} as MissionStatus);
  private _robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject<RobotInformation[]>([] as RobotInformation[]);

  constructor(private healthCheck: HealthService,
              public router: Router,
              private httpClient: HttpClient) {
  }

  getMissions() {
    this.httpClient.get(localUrl(""), {responseType: 'json'}).subscribe((data) => {
      if (data) {
        const missions = JSON.parse(data as string) as MissionStatus[];
        this._missions.next(missions);
      }
    });
    return this._missions;
  }

  getLogs(missionId: number) {
    this.httpClient.get(localUrl(`logs/${missionId}`), {responseType: 'json'}).subscribe((data) => {
      if (data) {
        const logs = JSON.parse(data as string) as Logs[];
        this._logs.next(logs);
      }
    });
    return this._logs;
  }

  getMap(missionId: number) {
    this.httpClient.get(localUrl(`map/${missionId}`), {responseType: 'text'}).subscribe((data) => {
      if (data) {
        const image = new Image();
        image.onload = async () => {
          this._map.next(image);
        }
        image.src = data;
      }
    });
    return this._map;
  }

  getStatus(missionId: number) {
    this.httpClient.get(localUrl(`status/${missionId}`), {responseType: 'json'}).subscribe((data) => {
      if (data) {
        const status = JSON.parse(data as string) as MissionStatus;
        this._status.next(status);
      }
    });
    return this._status;
  }

  getRobots(missionId: number) {
    this.httpClient.get(localUrl(`robots/${missionId}`), {responseType: 'json'}).subscribe((data) => {
      if (data) {
        const status = JSON.parse(data as string) as RobotInformation[];
        this._robots.next(status);
      }
    });
    return this._robots;
  }
}
