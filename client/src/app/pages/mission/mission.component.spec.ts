import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MissionComponent} from './mission.component';
import {MatCard} from '@angular/material/card';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HealthService } from '@app/services/health/health.service';
import { Router } from '@angular/router';
import { SocketService } from '@app/services/socket/socket.service';
import { MissionService } from '@app/services/mission/mission.service';
import { Subject } from 'rxjs';
import { MissionStatus } from '@app/classes/mission-status';
import {MissionState} from '@app/classes/mission-status';


describe('MissionsComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;
  let healthServiceSpyObj: jasmine.SpyObj<HealthService>;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let missionStatus: Subject<MissionStatus>;

  beforeEach(async () => {
    missionStatus = new Subject<MissionStatus>();
    const missionServiceObj = jasmine.createSpyObj('MissionService', ['toggleMission'], { status: missionStatus});
    missionServiceObj.status.and.return(Promise.resolve())
    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };
    healthServiceSpyObj = jasmine.createSpyObj('HealthService', ['isServerOk']);
    healthServiceSpyObj.isServerOk.and.returnValue(Promise.reject());
    socketServiceObj = jasmine.createSpyObj('SocketService', {'on': missionStatus})
    await TestBed.configureTestingModule({
      imports: [MissionComponent, MatCard, BrowserModule, HttpClientModule, HttpClientTestingModule, BrowserAnimationsModule],
      providers: [
        { provide: HealthService, useValue: healthServiceSpyObj},
        { provide: SocketService, useValue: socketServiceObj},
        { provide: Router, useValue: routerMock},
        { provide: MissionService, useValue: missionServiceObj}
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
    expect(component.missionService.toggleMission()).toHaveBeenCalled();
  });

  it('it should return an array with the batteries', () => {
    expect(component.batteries);
  });

  it('it should', () => {
    expect(component.missionService.status).toHaveBeenCalled();
  });
});
