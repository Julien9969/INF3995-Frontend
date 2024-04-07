import {TestBed} from '@angular/core/testing';
import {MissionService} from './mission.service';
import {BehaviorSubject} from "rxjs";
import {MissionState, MissionStatus, WebsocketsEvents} from "@common";
import {SocketService} from "@app/services/socket/socket.service";


describe('MissionService', () => {
  let service: MissionService;
  let socketServiceObj: jasmine.SpyObj<SocketService>;

  beforeEach(() => {
    socketServiceObj = jasmine.createSpyObj('SocketService', ['send', 'disconnect', 'on'], {});
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: SocketService, useValue: socketServiceObj},
      ]
    });
    service = TestBed.inject(MissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
      robotCount: 789,
      batteries: [1, 2, 3],
      distances: [4, 5, 6]
    });

    service.updateMission(rawUpdate);

    expect(service.status.getValue().missionState).toEqual(MissionState.ONGOING);
    expect(service.status.getValue().startTimestamp).toEqual(123);
    expect(service.status.getValue().elapsedTime).toEqual(456);
  });

  it ('should use default values for mission fields in raw update', () => {
    const rawUpdate = JSON.stringify({
    });

    service.updateMission(rawUpdate);

    expect(service.status.getValue().missionState).toEqual(MissionState.NOT_STARTED);
    expect(service.status.getValue().startTimestamp).toEqual(0);
    expect(service.status.getValue().elapsedTime).toEqual(0);
    expect(service.status.getValue().robotCount).toEqual(0);
  });


  it('should start mission if Mission status is not not ongoing', () => {
    const mission: MissionStatus = {
      missionState: MissionState.NOT_STARTED,
      startTimestamp: 0,
      elapsedTime: 0,
      robotCount: 0,
      missionId: 1,
      isSimulation: false
    }

    service.status.next(mission);
    service.toggleMission();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_START);
  });

  /*it('should end mission if Mission status is ongoing', () => {
    const mission: MissionStatus = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      robotCount: 0,
      missionId: 1,
      isSimulation: false
    }
    spyOn(service.status, 'getValue').and.returnValue(mission);
    service.toggleMission();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_END);
  });*/

  it('should disconnect', () => {
    service.disconnect();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_END);
  });
});
