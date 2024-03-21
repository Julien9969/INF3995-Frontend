import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MissionComponent} from './mission.component';
import {MatCard} from '@angular/material/card';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HealthService} from '@app/services/health/health.service';
import {Router} from '@angular/router';
import {SocketService} from '@app/services/socket/socket.service';
import {MissionService} from '@app/services/mission/mission.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {MissionState, MissionStatus} from '@app/classes/mission-status';
import {Observable} from "rxjs/internal/Observable";
import {MatSnackBar} from "@angular/material/snack-bar";

describe('MissionsComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;
  let healthServiceSpyObj: jasmine.SpyObj<HealthService>;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let missionStatusSubject: BehaviorSubject<MissionStatus>;
  let routerMock: { navigate: any; };
  let matSnackSpy: jasmine.SpyObj<MatSnackBar>;
  const identifyResponse = new Subject<string>();

  beforeEach(async () => {
    const missionStatus: MissionStatus = {
      missionState: MissionState.ONGOING,
      startTimestamp: 0,
      elapsedTime: 0,
      batteries: [0,0],
      distances: [0,0],
      count: 2
    }
    missionStatusSubject = new BehaviorSubject<MissionStatus>(missionStatus);
    const missionServiceObj = jasmine.createSpyObj('MissionService', ['toggleMission', 'identify'], { status: missionStatusSubject });
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    missionServiceObj.identify.and.returnValue(identifyResponse.asObservable());
    healthServiceSpyObj = jasmine.createSpyObj('HealthService', ['isServerOk']);
    healthServiceSpyObj.isServerOk.and.returnValue(Promise.reject());
    socketServiceObj = jasmine.createSpyObj('SocketService', {'on': missionStatus})
    matSnackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [MissionComponent, MatCard, BrowserModule, HttpClientModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: HealthService, useValue: healthServiceSpyObj},
        { provide: SocketService, useValue: socketServiceObj},
        { provide: Router, useValue: routerMock},
        { provide: MissionService, useValue: missionServiceObj},
        { provide: MatSnackBar, useValue: matSnackSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should toggle mission', () => {
    component.toggleMission();
    expect(component.missionService.toggleMission).toHaveBeenCalled();
  });

  it('it should return an array with the batteries', () => {
    expect(component.batteries).toBeInstanceOf(Array<number>);
  });

  it('should route to error page', () => {
    expect(routerMock.navigate).toHaveBeenCalledWith(['/error']);
  });

  it('it should start mission and change ongoing mission', () => {
    component.ongoingMission = false;
    component.toggleMission();
    expect(component.missionService.toggleMission).toHaveBeenCalled();
    missionStatusSubject.next({missionState: MissionState.ONGOING, startTimestamp: 0, elapsedTime: 0, batteries: [0,0], distances: [0,0], count: 2})
    expect(component.ongoingMission).toBe(true);
  });

  it('it should stop mission and change ongoing mission', () => {
    component.ongoingMission = true;
    component.toggleMission();
    expect(component.missionService.toggleMission).toHaveBeenCalled();
    missionStatusSubject.next({missionState: MissionState.ENDED, startTimestamp: 0, elapsedTime: 0, batteries: [0,0], distances: [0,0], count: 2})
    expect(component.ongoingMission).toBe(false);
  });

  it('it should identify robots', () => {
    component.identifyRobots(1);
    identifyResponse.next('response');
    expect(component.missionService.identify).toHaveBeenCalledWith(1);
    expect(matSnackSpy['open']).toHaveBeenCalled();
  });
});
