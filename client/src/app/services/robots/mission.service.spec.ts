import {TestBed} from '@angular/core/testing';
import {MissionService} from './robots.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {MissionState, MissionStatus} from "@app/classes/mission-status";
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/classes/helpers/socket-mock-helper";
import {WebsocketsEvents} from "@app/classes/websockets-events";
import {environmentExt} from "@environment-ext";


const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

describe('MissionService', () => {
  let service: MissionService;
  let socketClient: SocketMock = new SocketMock();
  let httpTestingController: HttpTestingController;
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
      ]
    });
    service = TestBed.inject(MissionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_STATUS);
  });

  it('should subscribe to mission status updates in contructor', () => {

    service = TestBed.inject(MissionService);

    expect(socketServiceObj.on).toHaveBeenCalledWith(WebsocketsEvents.MISSION_STATUS, jasmine.any(Function));
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_STATUS);
  });

  it('should have default status', () => {
    expect(service.status).toBeInstanceOf(BehaviorSubject<MissionStatus>);
    expect(service.status.getValue().missionState).toEqual(MissionState.NOT_STARTED);
  });

  it ('should parse raw json and update mission status in updateMission', () => {
    const rawUpdate = JSON.stringify({
      missionState: MissionState.ONGOING,
      startTimestamp: 123,
      elapsedTime: 456,
      count: 789,
      batteries: [1, 2, 3],
      distances: [4, 5, 6]
    });

    service.updateMission(rawUpdate);

    expect(service.status.getValue().missionState).toEqual(MissionState.ONGOING);
    expect(service.status.getValue().startTimestamp).toEqual(123);
    expect(service.status.getValue().elapsedTime).toEqual(456);
    expect(service.status.getValue().count).toEqual(789);
    expect(service.status.getValue().batteries).toEqual([1, 2, 3]);
    expect(service.status.getValue().distances).toEqual([4, 5, 6]);
  });

  it ('should use default values for mission fields in raw update', () => {
    const rawUpdate = JSON.stringify({
    });

    service.updateMission(rawUpdate);

    expect(service.status.getValue().missionState).toEqual(MissionState.NOT_STARTED);
    expect(service.status.getValue().startTimestamp).toEqual(0);
    expect(service.status.getValue().elapsedTime).toEqual(0);
    expect(service.status.getValue().count).toEqual(0);
    expect(service.status.getValue().batteries).toEqual([]);
    expect(service.status.getValue().distances).toEqual([]);
  });


  it('should start mission if Mission status is not not ongoing', () => {
    const mission: MissionStatus = {
      missionState: MissionState.NOT_STARTED,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }

    spyOn(service.status, 'getValue').and.returnValue(mission);
    service.toggleMission();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_START);
  });

  it('should end mission if Mission status is ongoing', () => {
    const mission: MissionStatus = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      count: 0,
      batteries: [],
      distances: []
    }
    spyOn(service.status, 'getValue').and.returnValue(mission);
    service.toggleMission();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_END);
  });

  it('should return identification information for the given robotId', () => {
    const robotId = 123;
    const mockResponse = 'Identification information';

    service.identify(robotId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(localUrl(`identify/id/${robotId}`));
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);

  });
});
