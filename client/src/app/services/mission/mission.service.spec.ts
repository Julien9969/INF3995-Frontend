import {TestBed} from '@angular/core/testing';
import {MissionService} from './mission.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {MissionState, MissionStatus} from "@app/classes/mission-status";
import {SocketService} from "@app/services/socket/socket.service";
import {environmentExt} from "@environment-ext";

describe('MissionService', () => {
  let service: MissionService;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let socketObservable: BehaviorSubject<MissionStatus>;
  let httpSpyObj: jasmine.SpyObj<HttpClient>;
  let missionStarted: MissionStatus;

  beforeEach(() => {
    missionStarted = {
      missionState: MissionState.NOT_STARTED,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    socketObservable = new BehaviorSubject<MissionStatus>(missionStarted);
    socketServiceObj = jasmine.createSpyObj('SocketService', ['send', 'on'], )
    httpSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'pipe']);
    const callback = (event: string, action: (Param: any) => void) => {
      action("{}")
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
    service.toggleMission();
    socketObservable.next(missionStarted); // receive ok from server
    expect(service.status.getValue().missionState).toEqual('ongoing');
    expect(socketServiceObj.send).toHaveBeenCalledWith('mission-start');
  });

  it('should stop mission', () => {
    expect(socketServiceObj.send).toHaveBeenCalledWith('mission-status'); // because called in constructor
    const callback = (event: string, action: (Param: any) => void) => {
      action(missionStarted)
    };
    socketServiceObj.on.and.callFake(callback);
    service.toggleMission(); // start mission
    expect(socketServiceObj.send).toHaveBeenCalledWith('mission-start');
    missionStarted.missionState = MissionState.ENDED;
    socketObservable.next(missionStarted); // receive ok from server
    service.toggleMission(); // stop mission
    expect(socketServiceObj.send).toHaveBeenCalledWith('mission-end');
    missionStarted.missionState = MissionState.ENDED;
    socketObservable.next(missionStarted); // receive ok from server
    expect(service.status.getValue().missionState).toEqual('ended');
  });

  it('should send a request to identify ', () => {
    service.identify(1);
    const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;
    expect(httpSpyObj.get).toHaveBeenCalled();
  });
});
