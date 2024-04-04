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
import {MissionState, MissionStatus} from '@common';
import {MatSnackBar} from "@angular/material/snack-bar";
import {RobotsService} from "@app/services/robots/robots.service";

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
      missionId: 0,
      startTimestamp: 0,
      elapsedTime: 0,
      robotCount: 2
    }
    missionStatusSubject = new BehaviorSubject<MissionStatus>(missionStatus);
    const missionServiceObj = jasmine.createSpyObj('MissionService', ['toggleMission', 'identify'], { status: missionStatusSubject });
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    missionServiceObj.identify.and.returnValue(identifyResponse.asObservable());
    healthServiceSpyObj = jasmine.createSpyObj('HealthService', ['isServerOk']);
    socketServiceObj = jasmine.createSpyObj('SocketService', {'on': missionStatus})
    matSnackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [MissionComponent, MatCard, BrowserModule, HttpClientModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: HealthService, useValue: healthServiceSpyObj},
        { provide: SocketService, useValue: socketServiceObj},
        { provide: Router, useValue: routerMock},
        { provide: MissionService, useValue: missionServiceObj},
        { provide: MatSnackBar, useValue: matSnackSpy},
        { provide: RobotsService, useValue: jasmine.createSpyObj('RobotsService', ['getRobots'])}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
