import {TestBed} from '@angular/core/testing';
import {MissionService} from './mission.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {MissionState, MissionStatus} from "@app/classes/mission-status";
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/classes/helpers/socket-mock-helper";
import {WebsocketsEvents} from "@app/classes/websockets-events";

describe('MissionService', () => {
  let service: MissionService;
  let socketClient: SocketMock = new SocketMock();
  let onSpy = jasmine.createSpy('on');
  let socketServiceObj = {
    socketClient: socketClient,
    on: onSpy,
    send: jasmine.createSpy()
  };
  let httpSpyObj: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'pipe']);
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
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_STATUS);
  });

  it('should have default status', () => {
    expect(service.status).toBeInstanceOf(BehaviorSubject<MissionStatus>);
    expect(service.status.getValue().missionState).toEqual(MissionState.NOT_STARTED);
  });


  it('should start mission', () => {
    const mission: MissionStatus = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    const callback = (event: string, action: (Param: any) => void) => {
      action(JSON.stringify(mission));
    };
    onSpy.and.callFake(callback);
    service.toggleMission();
    socketClient.triggerEndpoint(WebsocketsEvents.MISSION_STATUS, "{}");
    expect(service.status.getValue().missionState).toEqual(MissionState.ONGOING);
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_START);
  });

  it('should send a request to identify ', () => {
    service.identify(1);
    expect(httpSpyObj.get).toHaveBeenCalled();
  });
});
