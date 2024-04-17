import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionViewComponent} from './mission-view.component';
import {MissionService} from "@app/services/mission/mission.service";
import {Observable} from "rxjs/internal/Observable";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject, of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";
import {LogsService} from "@app/services/logs/logs.service";
import {MapService} from "@app/services/map/map.service";
import {RobotsService} from "@app/services/robots/robots.service";
import {
  EmitFeedback,
  HealthState,
  MissionState,
  MissionStatus,
} from "@common";
import {SocketService} from "@app/services/socket/socket.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {HealthService} from "@app/services/health/health.service";


describe('MissionViewComponent', () => {
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;
  let missionServiceSpyObj: jasmine.SpyObj<MissionService>;
  let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
  let logsServiceSpyObj: jasmine.SpyObj<LogsService>;
  let mapServiceSpyObj: jasmine.SpyObj<MapService>;
  let robotsServiceSpyObj: jasmine.SpyObj<RobotsService>;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let matSnackBarObj: jasmine.SpyObj<MatSnackBar>;
  let healthServiceSpyObj: jasmine.SpyObj<HealthService>;
  let paramObservable: BehaviorSubject<any>;
  let activateRouteObj: any;
  let checkObservable: BehaviorSubject<HealthState>;

  beforeEach(async () => {
    checkObservable = new BehaviorSubject<HealthState>(HealthState.HEALTHY);
    missionServiceSpyObj = jasmine.createSpyObj('MissionService', ['disconnect', 'toggleMission'], {status: new Observable()});
    historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['getMissions', 'getStatus', 'getRobots', 'getMap', 'getLogs'], {});
    logsServiceSpyObj = jasmine.createSpyObj('LogsService', [], {logs: new BehaviorSubject([])});
    mapServiceSpyObj = jasmine.createSpyObj('MapService', [], {image: new BehaviorSubject(new Image())});
    robotsServiceSpyObj = jasmine.createSpyObj('RobotsService', ['headBackBase'], {robots: new BehaviorSubject([])});
    mapServiceSpyObj = jasmine.createSpyObj('MapService', [], {map: new BehaviorSubject(new Image())});
    robotsServiceSpyObj = jasmine.createSpyObj('RobotsService', ['headBackBase', 'checkConnection'], {robots: new BehaviorSubject([])});
    socketServiceObj = jasmine.createSpyObj('SocketService', ['send', 'on'], {socketClient: {}});
    matSnackBarObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    healthServiceSpyObj = jasmine.createSpyObj('HealthService', [''], {check: checkObservable});
    paramObservable = new BehaviorSubject({get: () => "1"})


    activateRouteObj = {
      snapshot: {
        paramMap: {
          get: () => "1"
        }
      }
    }
    missionServiceSpyObj.toggleMission.and.callFake(() => {
      component.missionState = component.missionState === MissionState.ONGOING ? MissionState.ENDED : MissionState.ONGOING;
    });

    const missions = new BehaviorSubject<MissionStatus[]>([{
      missionId: 0,
      robotCount: 1,
      startTimestamp: 1,
      elapsedTime: 1,
      missionState: MissionState.ONGOING,
      isSimulation: false,
      distance: 1,
    }]);
    historyServiceSpyObj.getMissions.and.returnValue(missions);
    const headBackBase = new BehaviorSubject<EmitFeedback>({} as EmitFeedback);
    robotsServiceSpyObj.headBackBase.and.returnValue(headBackBase);
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, NoopAnimationsModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => {
              return {
                afterClosed() {
                  return of(true);
                }
              };
            }
          }
        },
        {
          provide: ActivatedRoute,
          useValue: activateRouteObj,
        },
        {provide: SocketService, useValue: socketServiceObj},
        {provide: MissionService, useValue: missionServiceSpyObj},
        {provide: HistoryService, useValue: historyServiceSpyObj},
        {provide: LogsService, useValue: logsServiceSpyObj},
        {provide: MapService, useValue: mapServiceSpyObj},
        {provide: RobotsService, useValue: robotsServiceSpyObj},
        {provide: MatSnackBar, useValue: matSnackBarObj},
        {provide: HealthService, useValue: healthServiceSpyObj},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionViewComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    paramObservable.next({get: () => "1"});
    expect(component).toBeTruthy();
  });

  it("should load history data", () => {
    paramObservable.next({get: () => "1"});
    component.loadData(false);
    expect(component).toBeTruthy();
  });


  it("should toggle mission", () => {
    component.ngOnInit();
    component.toggleMission();
    expect(component.missionState).toEqual(MissionState.ONGOING);
    component.toggleMission();
    expect(component.missionState).toEqual(MissionState.ENDED);
  });

  it("should call checkConnectedRobots", () => {
    component.ngOnInit();
    expect(robotsServiceSpyObj.checkConnection).toHaveBeenCalled();
  });


  it("should call head back base", () => {
    component.toggleHeadBackBase();
    expect(robotsServiceSpyObj.headBackBase).toHaveBeenCalled();
  });


  it("should call openSnackBar", () => {
    component.openSnackBar("test");
    expect(matSnackBarObj.open).toHaveBeenCalled();
  });

  it("should call ngOnInit", () => {
    checkObservable.next(HealthState.HEALTHY);
  });
});
