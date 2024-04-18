import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogsComponent} from './logs.component';
import {MatDialogClose} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {BehaviorSubject} from "rxjs";
import {Logs} from "@common";
import {LogsService} from "@app/services/logs/logs.service";
import {MatSort, MatSortModule} from "@angular/material/sort";


describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;
  let logServiceSpyObj: jasmine.SpyObj<LogsComponent>;
  let logsObservable: BehaviorSubject<Logs[]>;
  let matSortSpyObj: jasmine.SpyObj<MatSort>;

  beforeEach(async () => {
    logsObservable = new BehaviorSubject<Logs[]>([] as Logs[]);
    logServiceSpyObj = jasmine.createSpyObj('LogsService', [], {logs: logsObservable.asObservable()});
    matSortSpyObj = jasmine.createSpyObj('MatSort', ['sortChange'], {active: 'timestamp', direction: 'asc'});
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LogsComponent, MatDialogClose, MatTableModule, MatSortModule],
      providers: [
        {provide: LogsService, useValue: logServiceSpyObj},
        {provide: MatSort, useValue: matSortSpyObj},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    component.logs = logsObservable;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove filters', () => {
    component.toggleFilter('log');
    expect(component['activeFilters'].size).toBe(1);
    component.removeFilter('log');
    expect(component['activeFilters'].size).toBe(0);
  });

  it('should toggle filters', () => {
    component.toggleFilter('log');
    expect(component['activeFilters'].size).toBe(1);
    component.toggleFilter('log');
    expect(component['activeFilters'].size).toBe(0);
  });

  it("should add log", () => {
    expect(component.dataSource.data.length).toBe(0);
    const log = {
      eventType: "test",
      robotId: 1,
      message: "test",
      timestamp: 1,
      missionId: 1
    };
    logsObservable.next([log])
    expect(component.dataSource.data.length).toBe(1);
  });

});
