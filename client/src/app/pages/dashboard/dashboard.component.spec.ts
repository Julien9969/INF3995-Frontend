/* eslint-disable @typescript-eslint/no-explicit-any */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{
        provide: HttpClient, useValue: {
          ping: () => {
            return new Observable<any>()
          }, get(): Observable<any> {
            return new Observable<any>()
          }
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
