import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionViewComponent} from './mission-view.component';
import {MissionService} from "@app/services/mission/mission.service";
import {Observable} from "rxjs/internal/Observable";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";

describe('MissionDetailsComponent', () => {
  let component: MissionViewComponent;
  let fixture: ComponentFixture<MissionViewComponent>;

  beforeEach(async () => {
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
        }]
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
