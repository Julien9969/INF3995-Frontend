import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogsComponent} from './logs.component';
import {MatDialogClose} from '@angular/material/dialog';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule} from '@angular/material/table';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsComponent, MatDialogClose, MatTableModule, MatIcon, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatCard, BrowserAnimationsModule, HttpClientTestingModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
