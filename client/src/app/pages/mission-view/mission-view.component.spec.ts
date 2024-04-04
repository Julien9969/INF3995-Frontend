import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionViewComponent} from './mission-view.component';
import {MissionService} from "@app/services/mission/mission.service";
import {Observable} from "rxjs/internal/Observable";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";
import {LogsService} from "@app/services/logs/logs.service";
import {MapService} from "@app/services/map/map.service";
import {RobotsService} from "@app/services/robots/robots.service";

describe('MissionDetailsComponent', () => {
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;
  let missionServiceSpyObj: jasmine.SpyObj<MissionService>;
  let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
  let logsServiceSpyObj: jasmine.SpyObj<LogsService>;
  let mapServiceSpyObj: jasmine.SpyObj<MapService>;
  let robotsServiceSpyObj: jasmine.SpyObj<LogsService>;

  beforeEach(async () => {
    missionServiceSpyObj = jasmine.createSpyObj('MissionService', [], {status: new Observable()});
    historyServiceSpyObj = jasmine.createSpyObj('HistoryService', ['getHistory', 'getStatus', 'getRobots', 'getMap'], {status: new Observable()});
    logsServiceSpyObj = jasmine.createSpyObj('LogsService', [], {logs: new Observable()});
    mapServiceSpyObj = jasmine.createSpyObj('MapService', [], {map: new Observable()});
    robotsServiceSpyObj = jasmine.createSpyObj('RobotsService', [], {robots: new Observable()});
    await TestBed.configureTestingModule({
      imports: [MissionViewComponent, HttpClientTestingModule],
      providers: [{
        provide: MissionService,
        useValue: jasmine.createSpyObj('MissionService', [], {status: new Observable()}),
      },
        {
          provide: DatePipe,
          useValue: {
            transform: (date: number) => '00:00:00'
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open() {
              return {
                afterClosed() {
                  return of('your result');
                }
              };
            }
          }
        }, {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: MissionService, useValue: missionServiceSpyObj },
        { provide: HistoryService, useValue: historyServiceSpyObj },
        { provide: LogsService, useValue: logsServiceSpyObj },
        { provide: MapService, useValue: mapServiceSpyObj },
        { provide: RobotsService, useValue: robotsServiceSpyObj},
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
