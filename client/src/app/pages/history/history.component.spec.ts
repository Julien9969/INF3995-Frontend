import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoryComponent} from './history.component';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import { MatTableModule} from "@angular/material/table";
import {MissionState, MissionStatus} from "@common";
import {HistoryService} from "@app/services/history/history.service";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let historyServiceSpyObj: jasmine.SpyObj<HistoryService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let observable: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  beforeEach(async () => {
    historyServiceSpyObj = jasmine.createSpyObj('HistoryService', [''], {getMissions: () => observable});
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [
        HistoryComponent,
        BrowserModule,
        HttpClientModule,
        MatTableModule,
      ],
      providers: [
        {provide: HistoryService, useValue: historyServiceSpyObj},
        {provide: Router, useValue: routerSpy},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should parse data", () => {
    const data: MissionStatus[] = [
      {
        missionId: 1,
        robotCount: 1,
        startTimestamp: 1,
        elapsedTime: 1,
        missionState: MissionState.ONGOING,
        isSimulation: false,
        distance: 1,
      }
    ];
    component.parseData(data);
    expect(component.dataSource.data.length).toEqual(data.length);
  });
});
