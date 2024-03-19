import {TestBed} from '@angular/core/testing';
import {MissionService} from './mission.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {MissionState, MissionStatus} from "@app/classes/mission-status";
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/classes/helpers/socket-mock-helper";
import {WebsocketsEvents} from "@app/classes/websockets-events";
let jsonMissionStarted: string;

describe('MissionService', () => {
  let service: MissionService;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let httpSpyObj: jasmine.SpyObj<HttpClient>;
  let socketClient: SocketMock = new SocketMock();

  beforeEach(() => {
    jsonMissionStarted = JSON.stringify({});
    socketServiceObj = jasmine.createSpyObj('SocketService', ['send', 'on'], { socketClient} )
    httpSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'pipe']);
    const callback = (event: string, action: (Param: any) => void) => {
      action(jsonMissionStarted);
    };
    socketServiceObj.on.and.callFake(callback);
    httpSpyObj.get.and.returnValue(new BehaviorSubject<string>(""));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SocketService, useValue: socketServiceObj},
        { provide: HttpClient, useValue: httpSpyObj }
      ]
    });
    service = TestBed.inject(MissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(socketServiceObj.send).toHaveBeenCalledWith('mission-status');
  });

  it('should have default status', () => {
    expect(service.status).toBeInstanceOf(BehaviorSubject<MissionStatus>);
    expect(service.status.getValue().missionState).toEqual(MissionState.NOT_STARTED);
  });

  it('should start mission', () => {
    const missionStarted = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    jsonMissionStarted = JSON.stringify(missionStarted);
    service.toggleMission();
    socketClient.triggerEndpoint(WebsocketsEvents.MISSION_STATUS, jsonMissionStarted);
    expect(service.status.getValue().missionState).toEqual(MissionState.ONGOING);
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_START);
  });

  it('should stop mission', () => {
    const missionStarted = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    jsonMissionStarted = JSON.stringify(missionStarted);
    service.toggleMission(); // start mission
    socketClient.triggerEndpoint(WebsocketsEvents.MISSION_STATUS, jsonMissionStarted); // receive ok from server
    expect(service.status.getValue().missionState).toEqual(MissionState.ONGOING);

    const missionEnded = {
      missionState: MissionState.ENDED,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    socketClient.triggerEndpoint(WebsocketsEvents.MISSION_STATUS, jsonMissionStarted); // receive ok from server
    service.toggleMission(); // stop mission
    expect(service.status.getValue().missionState).toEqual(MissionState.ENDED);
  });

  it('should send a request to identify ', () => {
    service.identify(1);
    expect(httpSpyObj.get).toHaveBeenCalled();
  });
});
