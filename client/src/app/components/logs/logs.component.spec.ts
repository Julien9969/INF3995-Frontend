import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogsComponent} from './logs.component';
import {MatDialogClose} from '@angular/material/dialog';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule} from '@angular/material/table';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BehaviorSubject, Subject} from "rxjs";
import {Logs} from "@app/classes/logs";
import {Observable} from "rxjs/internal/Observable";

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;
  let logServiceSpyObj: jasmine.SpyObj<LogsComponent>;
  let logsObservable: Subject<Logs[]>;

  beforeEach(async () => {
    logsObservable = new BehaviorSubject<Logs[]>([]);
    logServiceSpyObj = jasmine.createSpyObj('LogsService', { logs: logsObservable.asObservable() });
    await TestBed.configureTestingModule({
      imports: [LogsComponent, MatDialogClose, MatTableModule, MatIcon, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatCard, BrowserAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: LogsComponent, useValue: logServiceSpyObj}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove filters', () => {
    component.toggleFilter('test');
    expect(component.availableFilters.length).toBe(1);
    component.removeFilter('test');
    expect(component.availableFilters.length).toBe(0);
  });

  it('should toggle filters', () => {
    component.toggleFilter('test');
    expect(component.availableFilters.length).toBe(1);
    component.toggleFilter('test');
    expect(component.availableFilters.length).toBe(0);
  });

  it("should subscribe to logs", () => {
    expect(component.dataSource.data.length).toBe(0);
    logsObservable.next([{eventType: "test", robotId: 1, message: "test", timestamp: 1}])
    expect(component.dataSource.data.length).toBe(1);
  });

  it("should trigger predicate", () => {
    expect(component.predicate("test")).toBe(true);
    component.toggleFilter("test");
    expect(component.predicate("test")).toBe(false);
  });
});
