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
import {EmitFeedback, Logs, MissionState, MissionStatus, RobotInformation, WebsocketsEvents} from "@common";
import {SocketService} from "@app/services/socket/socket.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {Component, Input, NO_ERRORS_SCHEMA} from "@angular/core";
import {MissionComponent} from "@app/components/mission/mission.component";
import {RobotsViewComponent} from "@app/components/robots-view/robots-view.component";
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {LogsComponent} from "@app/components/logs/logs.component";


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
  let matDialogObj: jasmine.SpyObj<MatDialog>;
  let activateRouterSpyObj: jasmine.SpyObj<ActivatedRoute>;
  let paramObservable: BehaviorSubject<any>;
  let activateRouteObj: any;

  beforeEach(async () => {
    missionServiceSpyObj = jasmine.createSpyObj('MissionService', ['disconnect', 'toggleMission'], {status: new Observable()});
    historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['getMissions', 'getStatus', 'getRobots', 'getMap', 'getLogs'], {});
    logsServiceSpyObj = jasmine.createSpyObj('LogsService', [], {logs: new BehaviorSubject([])});
    mapServiceSpyObj = jasmine.createSpyObj('MapService', [], {map: new BehaviorSubject(new Image())});
    robotsServiceSpyObj = jasmine.createSpyObj('RobotsService', ['headBackBase'], {robots: new BehaviorSubject([])});
    socketServiceObj = jasmine.createSpyObj('SocketService', ['send', 'on'], {socketClient: {}});
    matSnackBarObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    paramObservable = new BehaviorSubject({get: () => "1"})
    activateRouteObj = {
      snapshot: {
        paramMap: {
          get: () => "1"
        }
      }
    }

    const missions = new BehaviorSubject<MissionStatus[]>([{
      missionId: 1,
      robotCount: 1,
      startTimestamp: 1,
      elapsedTime: 1,
      missionState: MissionState.ONGOING,
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


  it("should toggle mission", () => {
    component.ngOnInit();
    component.toggleMission();
    // expect(component.missionState).toEqual(MissionState.ONGOING);
    // expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_END);
    component.toggleMission();
    // expect(component.missionState).toEqual(MissionState.NOT_STARTED);
    // expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.MISSION_START);
  });


  it("should call head back base", () => {
    component.toggleHeadBackBase();
    expect(robotsServiceSpyObj.headBackBase).toHaveBeenCalled();
  });

  it("should refresh page ", () => {
    component.onBeforeUnload(); // TODO:
  });
});
