import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MissionComponent} from './mission.component';
import {MatCard} from '@angular/material/card';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HealthService} from '@app/services/health/health.service';
import {Router} from '@angular/router';
import {SocketService} from '@app/services/socket/socket.service';
import {MissionService} from '@app/services/mission/mission.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {EmitFeedback, MissionState, MissionStatus} from '@common';
import {MatSnackBar} from "@angular/material/snack-bar";
import {RobotsService} from "@app/services/robots/robots.service";

describe('MissionComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;
  let robotServiceSpyObj: jasmine.SpyObj<RobotsService>;
  let socketServiceSpyObj: jasmine.SpyObj<SocketService>;
  let identifyObservable: Subject<EmitFeedback> = new Subject<EmitFeedback>;

  beforeEach(async () => {
    robotServiceSpyObj = jasmine.createSpyObj('RobotsService', [''], { identify: identifyObservable });
    socketServiceSpyObj = jasmine.createSpyObj('SocketService', ['on', 'send']);
    await TestBed.configureTestingModule({
      providers: [
        {provide: RobotsService, useValue: robotServiceSpyObj},
        {provide: SocketService, useValue: socketServiceSpyObj},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    component.missionState = MissionState.NOT_STARTED;
    component.status = new BehaviorSubject<MissionStatus>({
      missionId: 1,
      elapsedTime: 10,
      missionState: MissionState.NOT_STARTED,
      startTimestamp: 0,
      robotCount: 1,
      isSimulation: false,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
