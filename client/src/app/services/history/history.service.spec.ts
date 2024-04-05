import {TestBed} from '@angular/core/testing';

import {HistoryService} from './history.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {environmentExt} from "@environment-ext";
import {Logs, MissionState, MissionStatus, RobotInformation} from "@common";

const localUrl = (call: string) => `${environmentExt.apiUrl}history/${call}`;


describe('HistoryService', () => {
  let service: HistoryService;
  let dataObservable: BehaviorSubject<unknown> = new BehaviorSubject<unknown>([])
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
      ]
    });
    service = TestBed.inject(HistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return missions', () => {
    const missions: MissionStatus[] = [{
      missionId: 1,
      robotCount: 1,
      startTimestamp: 1,
      elapsedTime: 1,
      missionState: MissionState.ONGOING,
    }];
    const _missions = service.getMissions()
    const request = httpMock.expectOne(localUrl(''));
    request.flush(JSON.stringify(missions))
    expect(_missions.getValue().length).toEqual(missions.length);
  });

  it('should return logs', () => {
    const missionId = 1;
    const logs: Logs[] = [{
      robotId: 1,
      missionId: missionId,
      timestamp: 1,
      message: "test",
      eventType: "test",
    }];

    const _logs = service.getLogs(missionId)
    const request = httpMock.expectOne(localUrl('logs/1'));
    request.flush(JSON.stringify(logs))
    console.log("Logs", _logs.getValue())
    _logs.subscribe((logs) => {
      expect(logs.length).toEqual(logs.length);
    });
  });

  it('should return robots', () => {
    const missionId = 1;
    const robots: RobotInformation[] = [{
      id: 1,
      battery: 1,
      distance: 1,
      lastUpdate: 1,
      name: "test",
      position: {
        x: 1,
        y: 1,
      },
      state: "test",
      initialPosition: {
        x: 1,
        y: 1,
      }
    }];
    const _robots = service.getRobots(missionId)
    const request = httpMock.expectOne(localUrl(`robots/${missionId}`));
    request.flush(JSON.stringify(robots))
    expect(_robots.getValue().length).toEqual(robots.length);
  });

  it('should return status', () => {
    const missionId = 1;
    const status: MissionStatus = {
      missionId: missionId,
      robotCount: 1,
      startTimestamp: 1,
      elapsedTime: 1,
      missionState: MissionState.ONGOING,
    };
    const _status = service.getStatus(missionId)
    const request = httpMock.expectOne(localUrl(`status/${missionId}`));
    request.flush(JSON.stringify(status))
    const result = _status.getValue()
    _status.subscribe((status) => {
      expect(status).toEqual(result);
    });
  });

  it('should return map', () => {
    const missionId = 1
    const map = "test";
    const _map = service.getMap(missionId)
    const request = httpMock.expectOne(localUrl(`map/${missionId}`));
    request.flush(map)
    expect(_map.getValue()).toBeInstanceOf(Image);
  });
});
