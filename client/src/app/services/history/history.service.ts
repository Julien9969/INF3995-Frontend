import { Injectable } from '@angular/core';
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import {BehaviorSubject} from "rxjs";
import {Logs} from "@app/classes/logs";

const localUrl = (call: string) => `${environmentExt.apiUrl}history${call}`;

export interface HistoryData {
  id: number,
  startTimestamp: number,
  duration: number,
  nbRobots: number,
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _missions: BehaviorSubject<HistoryData[]> = new BehaviorSubject<HistoryData[]>([]);
  private _logs: BehaviorSubject<Logs[]> = new BehaviorSubject<Logs[]>([]);
  private _map: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(new Image());
  private historyLoaded: boolean = false;

  constructor(private healthCheck: HealthService,
              public router: Router,
              private httpClient: HttpClient) {
    this.healthCheck.check.subscribe((connected) => {
      if(connected && this._missions.getValue().length === 0 && !this.historyLoaded) {
        this.queryHistory() // Make sure server is reachable before first query
        this.historyLoaded = true;
      }
    });
  }

  private queryHistory(): void {
    this.httpClient.get(localUrl(""), {responseType: 'json'}).subscribe((data) => {
      if(data) {
        const history = data as HistoryData[];
        this._missions.next(history);
      }
    });
  }

  getMissions() {
    return this._missions;
  }

  getLogs(missionId: number) {
    this.httpClient.get(localUrl(`logs/${missionId}`), {responseType: 'json'}).subscribe((data) => {
      if(data) {
        const logs = data as Logs[];
        this._logs.next(logs);
      }
    });
    return this._logs;
  }

  getMap(missionId: number) {
    this.httpClient.get(localUrl(`map/${missionId}`), {responseType: 'text'}).subscribe((data) => {
      if(data) {
        const image = new Image();
        image.src = data;
        this._map.next(image); // returns base 64 encoded image
      }
    });
    return this._map;
  }
}
