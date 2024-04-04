import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogsComponent} from './logs.component';
import {MatDialogClose} from '@angular/material/dialog';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule} from '@angular/material/table';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BehaviorSubject, Subject} from "rxjs";
import {Logs} from "@common";
import {LogsService} from "@app/services/logs/logs.service";


describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;
  let logServiceSpyObj: jasmine.SpyObj<LogsComponent>;
  let logsObservable: BehaviorSubject<Logs[]>;

  beforeEach(async () => {
    logsObservable = new BehaviorSubject<Logs[]>([] as Logs[]);
    logServiceSpyObj = jasmine.createSpyObj('LogsService', [],{ logs: logsObservable.asObservable() });
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LogsComponent, MatDialogClose, MatTableModule, MatIcon, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatCard, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: LogsService, useValue: logServiceSpyObj}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    component.logs = new BehaviorSubject([] as Logs[]);
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

  it("should trigger predicate", () => {
    expect(component.predicate("test")).toBe(true);
    component.toggleFilter("test");
    expect(component.predicate("test")).toBe(false);
  });
});
