import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionViewComponent} from './mission-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MissionService} from "@app/services/mission/mission.service";
import {Observable} from "rxjs/internal/Observable";
import {DatePipe} from "@angular/common";

describe('MissionDetailsComponent', () => {
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionViewComponent],
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

    fixture = TestBed.createComponent(MissionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
