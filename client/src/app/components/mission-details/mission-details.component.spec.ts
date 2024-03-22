import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionDetailsComponent} from './mission-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MissionService} from "@app/services/mission/mission.service";
import {Observable} from "rxjs/internal/Observable";
import {DatePipe} from "@angular/common";

describe('MissionDetailsComponent', () => {
  let component: MissionDetailsComponent;
  let fixture: ComponentFixture<MissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MissionDetailsComponent],
      providers: [{
        provide: MissionService,
        useValue: jasmine.createSpyObj('MissionService', [], {status: new Observable()}),
      },
        {
          provide: DatePipe,
          useValue: {
            transform: (date: number) => '00:00:00'
          },
        }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format time', () => {
    const timestamp = 180;
    const formattedTime = component.formatTime(timestamp)
    expect(formattedTime).toBe('03:00');
  });
});
