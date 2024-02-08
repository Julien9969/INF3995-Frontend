import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsComponent } from './logs.component';
import { MatDialogClose } from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef } from '@angular/material/table';

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [LogsComponent, MatDialogClose, MatTableModule, MatIcon, MatHeaderRowDef, MatRowDef, MatCellDef, MatHeaderCellDef, MatCard]
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
